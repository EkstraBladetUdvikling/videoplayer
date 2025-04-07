import { JWVideo } from './jwplayer';
import { JWVideoLIVE } from './jwplayer-live';
import type { IInitJWOptions, IJWVideoOptions } from './types';
import { videoState } from './videostate.svelte';

const autoPause = (isLive: boolean | undefined) => {
	if (isLive) {
		return false;
	}
	return true;
};

function addJWPlayer(libraryDNS: string, playerId: string) {
	const script = document.createElement('script');
	script.src = `https://${libraryDNS}/libraries/${playerId}.js`;

	script.addEventListener('load', () => {
		window.dispatchEvent(new CustomEvent('jwReadyEvent', { detail: { status: 'load' } }));
	});
	script.addEventListener('error', () => {
		window.dispatchEvent(new CustomEvent('jwReadyEvent', { detail: { status: 'error' } }));
	});
	document.head.appendChild(script);
}

export default class VideoHandler {
	constructor(videoOptions: IJWVideoOptions) {
		const { libraryDNS, playerId, initJWOptions } = videoOptions;
		const { allowFloating, autoPlay, isLive, isSmartphone, playerElement, playerParent } =
			initJWOptions;

		if (playerParent) {
			videoState.players.push(playerParent);
		}

		let autoPlayAllowed = false;
		if (autoPlay) {
			autoPlayAllowed = true;
		}

		const volume = 100;

		let floatingAllowed = false;
		if (allowFloating && !videoState.floatingUsed) {
			videoState.floatingUsed = true;
			floatingAllowed = true;
		}

		// const liveOptions = {
		//   channelId: '${ video.liveChannelId }',
		//   libraryDNS: '${libraryDNS}',
		//   placeholderImageId: 'placeholderImage_${video.playerId}',
		//   placeholderImageUrl: '${imageUrl}',
		//   propertyId: '${ propertyId }',
		//   vodAllowed: ${video.liveVodAllowed}
		// };

		const rollOptions = {
			adscheduleId: '${section.parameters[adscheduleSecParam]}',
			adschedulePath: '${adschedulePath}',
			articleTypeName: '${article.articleTypeName}',
			creativeTimeout: '60000', //  '${ section.parameters[creativeTimeoutParam] }' || '60000',
			disableRolls: false, // '${disableRolls}' === 'true',
			requestTimeout: '60000', // '${ section.parameters[requestTimeoutParam] }' || '60000',
			sectionPath: '${ video.sectionPath }',
			type: 'ptv', // '${ section.parameters["video.advertising.type"] }' || 'ptv',
			videoType: '${ video.context }'
		};

		const initObject = {
			allowFloating: floatingAllowed,
			articleId: '${video.articleId}',
			autoPause: autoPause(isLive),
			autoPlay: autoPlayAllowed,
			cookieless: true,
			duration: '${article.fields.duration}',
			environment: '${ environment }',
			fetchPlaylist: false, // '${ fetchPlaylist }' === 'true',
			// floatingOptions: {
			// 	articleTitleLength: ${fn:length(titleText)} ? ${fn:length(titleText)} : 0,
			// 	floatAllowed: floatingAllowed
			// },
			imageUrl: '${imageUrl}',
			inline: false, // '${isInline}' === 'true',
			isDiscovery: false, // "${video.provider eq 'discovery'}" === 'true',
			isLive,
			isSmartphone,
			libraryDNS: '${libraryDNS}',
			// liveOptions: liveOptions,
			maxResolution: '${section.parameters[maxResolution]}',
			playerElement: playerElement,
			playerElementId: '${video.playerId}',
			playerId: '${playerId}',
			playerParent: playerParent,
			// recommendationId: '${recommendationsList}',
			rollOptions,
			title: '${video.safeTitle}',
			volume,
			libraryDNS,
			playerId,
			...initJWOptions
		};

		const isPreview = window.location.search.indexOf('token') !== -1;
		if (isPreview) {
			addJWPlayer(libraryDNS, playerId);
			window.lwhb = {
				cmd: []
			};
			if (isLive) {
				new JWVideoLIVE(initObject);
			} else {
				new JWVideo(initObject);
			}
		} else {
			window.ebCMP.doWeHaveConsent({
				callback: (status: boolean) => {
					try {
						addJWPlayer(libraryDNS, playerId);

						if (playerElement && playerElement.firstChild) {
							while (playerElement.firstChild) {
								playerElement.removeChild(playerElement.firstChild);
							}
						}
						initObject.cookieless = !status;
						if (isLive) {
							new JWVideoLIVE(initObject);
						} else {
							new JWVideo(initObject);
						}
					} catch (err) {
						console.error({
							component: 'video-jwplayer',
							label: 'doWeHaveConsent',
							level: 'ERROR',
							message: err.message
						});
					}
				},
				consentTo: window.ebCMP.CONSENTNAMES.fullconsent
			});
		}
	}
}
