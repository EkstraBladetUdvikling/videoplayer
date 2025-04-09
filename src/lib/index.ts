import { JWVideo } from './jwplayer';
// import { JWVideoLIVE } from './jwplayer-live';
import type { IInitJWOptions, IRollOptions } from './types';
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

type IVideoHandlerOptionsFromJW = Pick<
	IInitJWOptions,
	| 'articleId'
	| 'clipId'
	| 'duration'
	| 'fetchPlaylist'
	| 'imageUrl'
	| 'inline'
	| 'isDiscovery'
	| 'isLive'
	// | 'isSmartphone'
	| 'libraryDNS'
	| 'maxResolution'
	| 'playerElement'
	| 'playerElementId'
	| 'playerId'
	| 'playerParent'
	| 'title'
>;

interface IVideoHandlerOptions {
	autoPlayAllowed: IInitJWOptions['autoPlay'];
	disableRolls: IRollOptions['disableRolls'];
	floatingAllowed: IInitJWOptions['allowFloating'];
	initObjectJW: IVideoHandlerOptionsFromJW;
}

export default class VideoHandler {
	constructor(videoOptions: IVideoHandlerOptions) {
		const { autoPlayAllowed = false, disableRolls, floatingAllowed, initObjectJW } = videoOptions;

		const { isLive, libraryDNS, playerId, playerElement, playerParent } = initObjectJW;

		if (playerParent) {
			videoState.players.push(playerParent);
		}

		let autoPlay = false;
		if (autoPlayAllowed) {
			autoPlay = true;
		}

		const volume = 100;

		let allowFloating = false;
		if (floatingAllowed && !videoState.floatingUsed) {
			videoState.floatingUsed = true;
			allowFloating = true;
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
			adschedulePath: 'https://cdn.jwplayer.com/v2/advertising/schedules/',
			articleTypeName: '${article.articleTypeName}',
			creativeTimeout: '60000', //  '${ section.parameters[creativeTimeoutParam] }' || '60000',
			disableRolls,
			requestTimeout: '60000', // '${ section.parameters[requestTimeoutParam] }' || '60000',
			sectionPath: '${ video.sectionPath }',
			type: 'ptv', // '${ section.parameters["video.advertising.type"] }' || 'ptv',
			videoType: '${ video.context }'
		};

		const initObject = {
			autoPlay,
			allowFloating,
			autoPause: autoPause(isLive),
			cookieless: true,
			environment: '${ environment }',
			// floatingOptions: {
			// 	articleTitleLength: ${fn:length(titleText)} ? ${fn:length(titleText)} : 0,
			// 	floatAllowed: floatingAllowed
			// },
			rollOptions,
			volume,
			...initObjectJW
		};

		console.log('initObject', initObject);

		// 	const isPreview = window.location.search.indexOf('token') !== -1;
		// 	if (isPreview) {
		// 		addJWPlayer(libraryDNS, playerId);
		// 		window.lwhb = {
		// 			cmd: []
		// 		};
		// 		if (isLive) {
		// 			// new JWVideoLIVE(initObject);
		// 			console.log('JWVideoLIVE', initObject);
		// 		} else {
		// 			new JWVideo(initObject);
		// 		}
		// 	} else {
		// 		window.ebCMP.doWeHaveConsent({
		// 			callback: (status: boolean) => {
		// 				try {
		// 					addJWPlayer(libraryDNS, playerId);

		// 					if (playerElement && playerElement.firstChild) {
		// 						while (playerElement.firstChild) {
		// 							playerElement.removeChild(playerElement.firstChild);
		// 						}
		// 					}
		// 					initObject.cookieless = !status;
		// 					if (isLive) {
		// 						// new JWVideoLIVE(initObject);
		// 						console.log('JWVideoLIVE', initObject);
		// 					} else {
		// 						new JWVideo(initObject);
		// 					}
		// 				} catch (err) {
		// 					console.error({
		// 						component: 'video-jwplayer',
		// 						label: 'doWeHaveConsent',
		// 						level: 'ERROR',
		// 						message: err.message
		// 					});
		// 				}
		// 			},
		// 			consentTo: window.ebCMP.CONSENTNAMES.fullconsent
		// 		});
		// 	}

		addJWPlayer(libraryDNS, playerId);
		new JWVideo(initObject);
	}
}
