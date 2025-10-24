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
	'autoPlay' | 'allowFloating' | 'cookieless' | 'rollsData'
> &
	Pick<IInitJWOptions, 'playerId'>;

interface IVideoHandlerOptions {
	autoPlayAllowed: IInitJWOptions['autoPlay'];
	floatingAllowed: IInitJWOptions['allowFloating'];
	initObjectJW: ILiveVideoHandlerOptionsFromJW;
	rollsData: IRollsHandlerReturn;
}

export default class VideoLiveHandler {
	constructor(videoOptions: IVideoHandlerOptions) {
		const { autoPlayAllowed = true, floatingAllowed, initObjectJW, rollsData } = videoOptions;

		const { disableRolls, libraryDNS, playerId } = initObjectJW;

		let autoPlay = false;
		if (autoPlayAllowed) {
			autoPlay = true;
		}

		// const rollOptions = {
		// 	adscheduleId: '${section.parameters[adscheduleSecParam]}',
		// 	adschedulePath: 'https://cdn.jwplayer.com/v2/advertising/schedules/',
		// 	articleTypeName: '${article.articleTypeName}',
		// 	creativeTimeout: '60000', //  '${ section.parameters[creativeTimeoutParam] }' || '60000',
		// 	requestTimeout: '60000', // '${ section.parameters[requestTimeoutParam] }' || '60000',
		// 	sectionPath: '${ video.sectionPath }',
		// 	type: 'ptv', // '${ section.parameters["video.advertising.type"] }' || 'ptv',
		// 	videoType: '${ video.context }'
		// };

		addJWPlayer(libraryDNS, playerId);

		const {
			isDrEdition,
			playerElementId,
			playerParent,
			channelId,
			placeholderImageId,
			placeholderImageUrl,
			vodAllowed,
			vodFunction
		} = initObjectJW;

		const liveInitObject: ILiveInitOptions = {
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
			rollsData,
			vodAllowed,
			vodFunction
		};

		new JWVideoLIVE(liveInitObject);
	}
}
