import { messageForUser } from './messageforuser';

// import type { IVideoHistoryState } from 'frontend/history/history';

import type { IInitJWOptions, ISetupJWOptions } from './types';

// import { isTest } from 'frontend/shared/util/environment';

import { getFloatingPlayer } from './followplayer';
import { liveWrapped } from './rolls/livewrapped';

export class JWVideo {
	private jwPlayerInstance: jwplayer.JWPlayer | null = null;

	constructor(initOptions: IInitJWOptions) {
		try {
			if (initOptions.isDiscovery) {
				this.checkDiscovery(initOptions);
			} else {
				this.setupJWPlayer(initOptions);
			}
		} catch (error) {
			console.error({
				component: 'EBJW',
				level: 'ERROR',
				message: (error as Error).message
			});
		}
	}

	private async checkDiscovery(checkDiscoveryOptions: IInitJWOptions) {
		try {
			const { inline, libraryDNS, playerElement, playerId, playerParent, clipId } =
				checkDiscoveryOptions;
			const discoveryUrl = `https://${libraryDNS}/players/${clipId}-${playerId}.js`;

			const discoveryResponse = await fetch(discoveryUrl, {
				headers: {},
				method: 'GET'
			});

			if (discoveryResponse.status >= 200 && discoveryResponse.status <= 299) {
				this.setupJWPlayer(checkDiscoveryOptions);
			} else {
				messageForUser({
					inline,
					playerElement,
					playerParent,
					type: 'geoHoldback'
				});
			}
		} catch (error) {
			console.error({
				component: 'EBJW',
				label: 'checkDiscovery',
				level: 'ERROR',
				message: (error as Error).message
			});
		}
	}

	private configurePlayer = async (configObject: ISetupJWOptions) => {
		const {
			// actAsPlay,
			// articleId,
			allowFloating,
			autoPause = true,
			cookieless,
			disableRolls,
			// environment,
			// fetchPlaylist,
			imageUrl,
			libraryDNS,
			maxResolution,
			playerElementId,
			recommendationId,
			title,
			clipId,
			volume,
			rollsData
		} = configObject;
		let { autoplayAllowed } = configObject;

		await this.blockUntilLoaded();

		if (!window.jwplayer) {
			console.error({
				component: 'JWPlayer',
				level: 'ERROR',
				message: 'jwplayer not loaded'
			});

			return { blockAutoPlayOnAdError: false, jwPlayerInstance: null };
		}

		const jwPlayerInstance = window.jwplayer(playerElementId) as jwplayer.JWPlayer;

		const floating = getFloatingPlayer(allowFloating);

		const maxRes = `max_resolution=${maxResolution ? maxResolution : '960'}`;

		const playlist = recommendationId
			? `//${libraryDNS}/v2/media/${clipId}?recommendations_playlist_id=${recommendationId}&${maxRes}`
			: `//${libraryDNS}/v2/media/${clipId}?${maxRes}`;

		const response = await fetch(playlist);
		const body = await response.json();
		body.playlist[0].title = title;

		const jwOptions: Partial<jwplayer.PlayerConfig> = {
			floating,
			image: imageUrl,
			playlist: body.playlist
		};

		/**
		 * Autopause
		 */
		jwOptions.autoPause = {
			pauseAds: autoPause,
			viewability: autoPause
		};
		// END Autoplay

		/**
		 * Autoplay
		 */
		let blockAutoPlayOnAdError = false;
		// let vpaValue = 'click';
		if (autoplayAllowed) {
			jwOptions.autostart = 'viewable';
			jwOptions.mute = true;
			blockAutoPlayOnAdError = true;
			// vpaValue = 'auto';
		} else {
			jwOptions.autostart = false;
			// Add poster video for non-autoplay videos
			const firstItem = body.playlist[0];
			firstItem.images.push({
				src: `https://cdn.jwplayer.com/v2/media/${clipId}/poster.mp4?width=640`,
				type: 'video/mp4',
				width: 640
			});
		}

		// if (location.hash === '#autoplay') {
		// 	jwOptions.autostart = true;
		// 	jwOptions.mute = false;
		// 	blockAutoPlayOnAdError = true;
		// 	vpaValue = 'auto';
		// }
		// END Autoplay

		if (!disableRolls) {
			const defaultAdvertising = window.jwplayer?.defaults.advertising ?? {};
			jwOptions.advertising = rollsData
				? {
						...defaultAdvertising,
						...rollsData.advertisingObject
					}
				: defaultAdvertising;
		}

		// if (!rollsObject.disableRolls) {
		// 	console.log('Rolls object', vpaValue);
		// 	// TODO: window.ebComponents.ebBanners.updateORTBData({ vpa: vpaValue });
		// }
		/* We load the data from a .json file from backend to secure
		 * JW's .related onPlay listener works properly
		 */
		// TODO: Play / Related
		// if (fetchPlaylist && actAsPlay) {
		// 	const pageSize = 20;
		// 	const relatedURL =
		// 		environment && isTest(environment)
		// 			? `https://video-service.test-ekstrabladet.services/JwPlaylist/?articleId=${articleId}&maxResolution=${maxResolution}&pageSize=${pageSize}`
		// 			: `https://video-service.ekstrabladet.services/JwPlaylist/?articleId=${articleId}&maxResolution=${maxResolution}&pageSize=${pageSize}`;
		// 	jwOptions.related = {
		// 		autoplaytimer: 10,
		// 		displayMode: 'shelf',
		// 		file: relatedURL,
		// 		onclick: 'play',
		// 		oncomplete: 'autoplay'
		// 	};
		// }

		if (cookieless) {
			jwOptions.doNotSaveCookies = true;
		}

		jwOptions.volume = volume;

		jwPlayerInstance.setup(jwOptions);

		// if (await window.eb.ready('ebLib')) {
		// 	window.playPauseHandler =
		// 		window.playPauseHandler || new window.ebComponents.ebLib.PlayPauseHandler();
		// 	window.playPauseHandler.addJWVideo(playerElementId, jwPlayerInstance);
		// }

		// TODO: Play/Related
		// if (actAsPlay) {
		// 	jwPlayerInstance.on('relatedReady', () => {
		// 		const relatedPlugin = jwPlayerInstance.getPlugin('related');

		// 		relatedPlugin.on('play', async (relatedVideoEl: any) => {
		// 			const newState = {
		// 				articleId: relatedVideoEl.item.articleId,
		// 				articleType: relatedVideoEl.item.articleType,
		// 				author: relatedVideoEl.item.author,
		// 				clipId: relatedVideoEl.item.mediaid,
		// 				description: relatedVideoEl.item.description,
		// 				duration: relatedVideoEl.item.escenicDuration,
		// 				page: relatedVideoEl.item.position,
		// 				published: {
		// 					publishDateISO: relatedVideoEl.item.publishedISO,
		// 					updateTimeISO: relatedVideoEl.item.updatedISO,
		// 					useUpdatedDate: relatedVideoEl.item.useUpdated
		// 				},
		// 				skid: relatedVideoEl.item.sectionId,
		// 				title: relatedVideoEl.item.title,
		// 				url: relatedVideoEl.item.url
		// 			};

		// 			// Update the page and ULR with the data related to the video
		// 			window.ebHistory.pushState(newState, relatedVideoEl.item.url);
		// 		});
		// 	});
		// }

		jwPlayerInstance.on('autostartNotAllowed', () => {
			autoplayAllowed = false;
		});

		if (rollsData)
			liveWrapped(rollsData.adUnitName, jwPlayerInstance, playerElementId, rollsData.urlFragments);

		return { blockAutoPlayOnAdError, jwPlayerInstance };
	};

	private async resetPlayer(
		playerOptions: IInitJWOptions,
		isAutoPlay: boolean
		// state?: IVideoHistoryState
	) {
		if (this.jwPlayerInstance) {
			this.jwPlayerInstance.stop();

			this.jwPlayerInstance.remove();

			// if (state) {
			// 	const { articleId, title, clipId } = state;
			// 	if (articleId) playerOptions.articleId = articleId.toString();
			// 	if (title) playerOptions.title = title;
			// 	if (clipId) playerOptions.clipId = clipId;
			// }

			// const autoPlayAllowed = state && state.autoPlayAllowed ? state.autoPlayAllowed : isAutoPlay;

			const { jwPlayerInstance: newJwPlayerInstance } = await this.configurePlayer({
				...playerOptions,
				autoplayAllowed: isAutoPlay
			});
			if (newJwPlayerInstance) this.jwPlayerInstance = newJwPlayerInstance;
		}
	}

	private async setupJWPlayer(playerOptions: IInitJWOptions) {
		try {
			const {
				// actAsPlay,
				autoPlay,
				playerElement
			} = playerOptions;

			const autoplayAllowed = location.hash === '#autoplay' || autoPlay;

			playerElement.className = '';
			playerElement.removeAttribute('style');

			const { blockAutoPlayOnAdError, jwPlayerInstance } = await this.configurePlayer({
				...playerOptions,
				autoplayAllowed
			});

			if (jwPlayerInstance) this.jwPlayerInstance = jwPlayerInstance;

			if (!this.jwPlayerInstance) {
				throw new Error('Player instance not created');
			}

			window.addEventListener('popstate', (ev) => {
				if (ev.state) {
					// this.resetPlayer(playerOptions, rollsObject, autoplayAllowed, ev.state);
					this.resetPlayer(playerOptions, autoplayAllowed);
				}
			});

			this.jwPlayerInstance?.on('adError', async () => {
				/**
				 * If an ad fails to play, we set the player to autostart false and mute false
				 * and then we try to play an ad again.
				 */
				if (blockAutoPlayOnAdError) {
					this.resetPlayer(playerOptions, false);
				}
			});
		} catch (error) {
			console.error({
				component: 'EBJW',
				label: 'setupJWPlayer',
				level: 'ERROR',
				message: (error as Error).message
			});
		}
	}

	private async blockUntilLoaded() {
		if (window.jwplayer) {
			return true;
		}
		return new Promise((resolve) =>
			window.addEventListener('jwReadyEvent', resolve, {
				// It is important to only trigger this listener once
				// so that we don't leak too many listeners.
				once: true,
				passive: true
			})
		);
	}
}
