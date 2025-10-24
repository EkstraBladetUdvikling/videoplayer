import { blockUntilLoaded } from './blockuntilloaded';

import { getFloatingPlayer } from './followplayer';

import type { IInitJWOptions, IJWLive } from './types';

export type ILiveInitOptions = IJWLive &
	Pick<
		IInitJWOptions,
		| 'allowFloating'
		| 'autoPlay'
		| 'autoPause'
		| 'cookieless'
		| 'disableRolls'
		| 'isDrEdition'
		| 'libraryDNS'
		| 'playerElementId'
		| 'playerParent'
		| 'rollsData'
	>;

export class JWVideoLIVE {
	private autoplayAllowed: boolean = true;
	private currentEventId: string = '';
	private disableRolls!: boolean;
	private hasBeenSetup = false;
	private HLS_BUFFER_STALL_WARNING = 334001;
	private intervalId: ReturnType<typeof setInterval> | void = undefined;
	private isPlayingClip = false;

	private LIVESTREAM_COMPLETE_ERROR = 230001;
	private MAX_RETRIES = 3;
	private options!: ILiveInitOptions;
	private placeholderImage!: HTMLImageElement;

	private jwPlayerInstance: jwplayer.JWPlayer | null = null;

	private playerParent!: HTMLElement;
	private UPDATE_FREQUENCY = 10 * 1e3;

	private VOD_CONFIG: Partial<jwplayer.PlayerConfig> = {
		repeat: false
	};

	constructor(optionsArg: ILiveInitOptions) {
		this.init(optionsArg);
	}

	private async init(optionsArg: ILiveInitOptions) {
		await blockUntilLoaded();

		try {
			this.options = optionsArg;

			this.disableRolls = this.options.disableRolls;

			const { autoPlay } = this.options;
			this.autoplayAllowed = autoPlay;

			if (!this.options.channelId.match(/[a-zA-Z0-9]{8}/)) {
				throw new Error('Please modify the channel ID');
			}

			const { placeholderImageId, playerElementId, playerParent } = this.options;

			this.placeholderImage = document.getElementById(placeholderImageId) as HTMLImageElement;

			/** The player on the page which we'll use for playback */

			this.jwPlayerInstance = window.jwplayer(playerElementId) as jwplayer.JWPlayer;

			this.playerParent = playerParent;

			this.checkChannelStatus();
		} catch (error) {
			console.error({
				component: 'EBJWLIVE',
				level: 'ERROR',
				message: (error as Error).message
			});
		}
	}

	/**
	 * Periodically checks whether the specified livestream channel is available, and if it is, configures the player
	 * to start playing it.
	 */
	private checkChannelStatus() {
		const { channelId, playerElementId, vodAllowed } = this.options;

		if (!this.intervalId) {
			// Make sure to execute this method every UPDATE_FREQUENCY milliseconds.
			this.intervalId = setInterval(() => this.checkChannelStatus(), this.UPDATE_FREQUENCY);
		}
		this.getChannelStatus(channelId).then(
			(channelStatus) => {
				let showPlaceholder = false;

				/* Have to find the player everytime incase the signal have been cutted then JW drawing new player */
				const videoPlayer = document.getElementById(playerElementId) as HTMLDivElement;
				this.playerParent.style.display = 'block';
				videoPlayer.style.display = 'block';
				if (this.placeholderImage) this.placeholderImage.style.display = 'none';

				if (channelStatus.status === 'active') {
					this.isPlayingClip = false;
					// Determine the id of the active event based on the returned status.
					const eventId = channelStatus.current_event;

					// Check if we have seen this eventId before.
					if (this.currentEventId === eventId) {
						// The eventId returned by the API was not a *new* event id.
						// Ignore it and continue polling until we see a new id.
						return;
					}
					this.currentEventId = eventId;

					// Stop polling the channel status.
					// this.intervalId = clearInterval(this.intervalId);

					// Attempt to configure the player in order to start livestream playback.
					this.configurePlayer(eventId).catch((error) => {
						console.error({
							component: 'EBJWLIVE',
							label: 'checkChannelStatus',
							level: 'ERROR',
							message: `Failed to start live event stream playback: ${(error as Error).message}`
						});
					});
				} else if (
					!this.isPlayingClip &&
					vodAllowed &&
					typeof this.options.vodFunction === 'function'
				) {
					this.options.vodFunction(channelId).then((responseData) => {
						if (responseData.length) {
							const completeEvent = responseData.find(
								(recentVideoEvent) => recentVideoEvent.status === 'completed'
							);

							if (completeEvent) {
								this.isPlayingClip = true;

								const { media_id: eventId } = completeEvent;
								// Check if we have seen this eventId before.
								if (this.currentEventId === eventId) {
									// The eventId returned by the API was not a *new* event id.
									// Ignore it and continue polling until we see a new id.
									return;
								}
								this.currentEventId = eventId as string;

								// Attempt to configure the player in order to start livestream playback.
								this.configurePlayer(eventId as string, true).catch((error) => {
									this.isPlayingClip = false;
									console.error({
										component: 'EBJWLIVE',
										label: 'checkChannelStatus',
										level: 'ERROR',
										message: `Failed to start clip playback: ${(error as Error).message}`
									});
								});
							} else if (this.placeholderImage) {
								showPlaceholder = true;
							}
						} else if (this.placeholderImage) {
							showPlaceholder = true;
						}
					});
				} else if (
					channelStatus.status === 'idle' &&
					!this.placeholderImage &&
					this.options.isDrEdition
				) {
					this.playerParent.style.display = 'none';
				} else if (this.placeholderImage && this.isPlayingClip === false) {
					showPlaceholder = true;
				}

				if (showPlaceholder) {
					this.placeholderImage.style.display = 'block';
					videoPlayer.style.display = 'none';
				}
			},
			(error) => {
				console.error({
					component: 'EBJWLIVE',
					label: 'checkChannelStatus',
					level: 'ERROR',
					message: `Unable to fetch the channel status for ${channelId}: ${(error as Error).message}`
				});
				// If we fail to retrieve the channel status, then give up.
				if (this.intervalId) this.intervalId = clearInterval(this.intervalId);
			}
		);
	}

	/**
	 * Utility function to fetch a JSON document.
	 *
	 * @param url
	 */
	private async fetchJSON(url: string, init?: RequestInit) {
		return await fetch(url, init).then((response) => {
			if (!response.ok) {
				throw new Error(`Unable to fetch ${url}: ${response.statusText}`);
			}
			return response.json();
		});
	}

	/**
	 * Fetches the current status of a Live Channel.
	 * Returns a promise that will yield the status for a particular channel.
	 *
	 * @param channelId The channel to fetch the status for.
	 */
	private getChannelStatus(channelId: string) {
		return this.fetchJSON(`//${this.options.libraryDNS}/live/channels/${channelId}.json`);
	}

	/**
	 * Fetches a JW Platform feed for a particular media item.
	 *
	 * @param videoId The media id to fetch a single item playlist for.
	 */
	private getPlaylist(videoId: string) {
		return this.fetchJSON(`//${this.options.libraryDNS}/v2/media/${videoId}`, {
			cache: 'no-cache'
		});
	}

	/**
	 * (Re-)configures the active playerInstance to play the livestream identified by eventId.
	 */
	private async configurePlayer(eventId: string, repeat = false) {
		try {
			// There may be a slight delay between the livestream becoming available, and its playlist to become available.
			// Therefore, we first attempt to fetch the playlist for the new live event, as soon as we have successfully fetched
			// a playlist, we will load it on the player and start playback of the livestream.
			let playlist;
			let attempts = 0;

			while (!playlist) {
				try {
					playlist = await this.getPlaylist(eventId);
				} catch (error) {
					++attempts;

					console.error({
						component: 'EBJWLIVE',
						label: 'configurePlayer',
						level: 'ERROR',
						message: (error as Error).message
					});

					if (attempts >= this.MAX_RETRIES) {
						// Manually set up the player if we were not able to retrieve the playlist after 3 retries
						playlist = {
							playlist: [
								{
									file: `//${this.options.libraryDNS}/live/events/${eventId}.m3u8`,
									mediaid: eventId
								}
							]
						};
						break;
					}
					// Retry with exponential backoff, i.e. first retry after 5, 10, 20, 40, 80 seconds
					// after which we ultimately give up.
					await this.sleep(2 ** (attempts - 1) * 5 * 1000);
				}
			}

			// this.VOD_CONFIG.repeat = repeat;

			if (!this.hasBeenSetup) {
				this.VOD_CONFIG.playlist = playlist.playlist;

				this.setupPlayer(this.VOD_CONFIG);
			} else {
				this.jwPlayerInstance?.load(playlist.playlist);
				this.jwPlayerInstance?.setConfig({ repeat });

				// Start playback
				this.jwPlayerInstance?.play();
			}
		} catch (error) {
			console.error({
				component: 'EBJWLIVE',
				label: 'configurePlayer',
				level: 'ERROR',
				message: (error as Error).message
			});
		}
	}

	private async setupPlayer(setupOptions: Partial<jwplayer.PlayerConfig>) {
		if (this.hasBeenSetup) return;

		const {
			allowFloating = false,
			autoPause,
			cookieless,
			playerElementId,
			rollsData
		} = this.options;

		const { placeholderImageUrl } = this.options;
		if (!window.jwplayer) {
			throw new Error('JW Player is not loaded');
		}

		this.jwPlayerInstance = window.jwplayer(playerElementId);
		this.hasBeenSetup = true;

		if (this.placeholderImage) {
			this.placeholderImage.style.display = 'none';
		}

		const { disableRolls } = this;

		const floating = getFloatingPlayer(allowFloating);

		const jwOptions: Partial<jwplayer.PlayerConfig> = {
			...setupOptions,
			floating,
			image: placeholderImageUrl
		};

		if (!disableRolls && rollsData) {
			const defaultAdvertising = window.jwplayer?.defaults.advertising ?? {};
			jwOptions.advertising = rollsData
				? {
						...defaultAdvertising,
						...rollsData.advertisingObject
					}
				: defaultAdvertising;
		}

		if (cookieless) {
			jwOptions.doNotSaveCookies = true;
		}

		/**
		 * Autopause
		 */
		if (!autoPause) {
			jwOptions.autoPause = {
				viewability: autoPause
			};
		}
		// END Autoplay

		if (this.autoplayAllowed) {
			jwOptions.autostart = 'viewable';
			jwOptions.mute = true;
		} else {
			jwOptions.autostart = false;
		}

		this.jwPlayerInstance?.setup(jwOptions);

		this.jwPlayerInstance?.on('ready', () => {
			this.updatePoster();
		});

		this.jwPlayerInstance?.on('autostartNotAllowed', () => {
			this.autoplayAllowed = false;
			this.updatePoster();
		});

		this.jwPlayerInstance?.on('adPlay', () => {
			this.disableRolls = true;
		});

		// Register an event listener that triggers when the JW Player has finished playing all
		// elements in its playlist. In this demo, this event is triggered when livestream playback
		// has finished.
		this.jwPlayerInstance?.on('playlistComplete', () => this.handleLivestreamFinished());

		// Register an event listener that triggers when the player emits an error.
		this.jwPlayerInstance?.on('error', (error) => {
			const { vodAllowed } = this.options;
			// Check if the error may have been because the livestream stopped updating, in this case
			// we'll switch back to playing the VOD.
			if (
				this.jwPlayerInstance &&
				this.jwPlayerInstance?.getPlaylistItem().mediaid !== this.currentEventId &&
				vodAllowed
			) {
				// Ignore errors during VOD playback.
				return;
			}
			if (error.code === this.LIVESTREAM_COMPLETE_ERROR) {
				this.handleLivestreamFinished();
			}
		});

		// Register an event listener which listens for buffer warnings from the player.
		// We can use the warnings generated by the player to realize a very fast switchover
		// between the livestream and the VOD asset.
		this.jwPlayerInstance?.on('warning', (warn) => {
			if (
				this.jwPlayerInstance &&
				this.jwPlayerInstance?.getPlaylistItem().mediaid !== this.currentEventId
			) {
				// Ignore warnings during VOD playback.
				return;
			}
			if (warn.code === this.HLS_BUFFER_STALL_WARNING) {
				// The player failed to buffer more media.
				// This *may* be an indicator that the livestream has finished - in this demo we'll switch back to attempting to play
				// the VOD asset if this is the case.
				this.handleLivestreamFinished();
			}
		});

		/*
		 * Longboat tracking
		 * JW event insceptor: https://www.jwplayer.com/developers/player-event-inspector/
		 */
		// if (longboatVideoObject) {
		// trackVideo({
		// 	isLive: true,
		// 	jwPlayerInstance: this.jwPlayerInstance,
		// 	longboatVideoObject
		// });
		// }
	}

	private handleLivestreamFinished() {
		if (this.intervalId) {
			// We are already checking for a livestream.
			// In this state there should not be a reason to re-initialize the player -- it should already be in the correct
			// state.
			return;
		}

		this.updatePoster();

		// Enable looping of media.
		// playerInstance.setConfig({repeat: true});
		// // Reload the VOD playlist.
		// playerInstance.load(VOD_PLAYLIST);
		if (this.options.channelId) {
			// Start checking for a new event.
			this.checkChannelStatus();
		}
		// playerInstance.play();
	}

	/**
	 * A simple utility method which can be used to wait for some time between retries.
	 *
	 * @param ms The amount of milliseconds to wait between retries.
	 */
	private sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private updatePoster() {
		const { placeholderImageUrl } = this.options;
		const previewEl = this.playerParent.querySelector('.jw-preview.jw-reset') as HTMLDivElement;
		previewEl.style.backgroundImage = `url('${placeholderImageUrl}')`;
	}
}
