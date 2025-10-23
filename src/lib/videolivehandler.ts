import type { IRollsHandlerReturn } from './rolls/rollshandler';
import { JWVideoLIVE, type ILiveInitOptions } from './jwplayer-live';
import type { IInitJWOptions } from './types';

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

type ILiveVideoHandlerOptionsFromJW = Omit<
	ILiveInitOptions,
	'autoPlay' | 'allowFloating' | 'cookieless'
> &
	Pick<IInitJWOptions, 'playerId'>;

interface IVideoHandlerOptions {
	autoPlayAllowed: IInitJWOptions['autoPlay'];
	floatingAllowed: IInitJWOptions['allowFloating'];
	initObjectJW: ILiveVideoHandlerOptionsFromJW;
	rollsData: IRollsHandlerReturn | undefined | null;
}

export default class VideoLiveHandler {
	constructor(videoOptions: IVideoHandlerOptions) {
		const { autoPlayAllowed = true, floatingAllowed, initObjectJW, rollsData } = videoOptions;

		const { libraryDNS, playerId } = initObjectJW;

		let autoPlay = false;
		if (autoPlayAllowed) {
			autoPlay = true;
		}

		// const liveOptions = {
		//   channelId: '${ video.liveChannelId }',
		//   libraryDNS: '${libraryDNS}',
		//   placeholderImageId: 'placeholderImage_${video.playerId}',
		//   placeholderImageUrl: '${imageUrl}',
		//   propertyId: '${ propertyId }',
		//   vodAllowed: ${video.liveVodAllowed}
		// };

		// const rollOptions = {
		// 	adscheduleId: '${section.parameters[adscheduleSecParam]}',
		// 	adschedulePath: 'https://cdn.jwplayer.com/v2/advertising/schedules/',
		// 	articleTypeName: '${article.articleTypeName}',
		// 	creativeTimeout: '60000', //  '${ section.parameters[creativeTimeoutParam] }' || '60000',
		// 	disableRolls,
		// 	requestTimeout: '60000', // '${ section.parameters[requestTimeoutParam] }' || '60000',
		// 	sectionPath: '${ video.sectionPath }',
		// 	type: 'ptv', // '${ section.parameters["video.advertising.type"] }' || 'ptv',
		// 	videoType: '${ video.context }'
		// };

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
		const {
			disableRolls,
			isDrEdition,
			playerElementId,
			playerParent,
			channelId,
			placeholderImageId,
			placeholderImageUrl,
			vodAllowed
		} = initObjectJW;

		console.log('vodAllowed', vodAllowed);

		const liveInitObject = {
			autoPlay,
			allowFloating: floatingAllowed,
			autoPause: false,
			cookieless: true,
			disableRolls,
			isDrEdition,
			libraryDNS,
			playerElementId,
			playerParent,
			channelId,
			placeholderImageId,
			placeholderImageUrl,
			vodAllowed
		};

		new JWVideoLIVE(liveInitObject);
	}
}
