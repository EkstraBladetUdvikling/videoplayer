// import { getGroupName } from 'frontend/js-admanager/src';

import type { IJWPlayerInstance } from '$lib/types/window';
import { getAdschedule } from './adschedulehandler';
import { getPrebidTag } from './prebidtag';

import { getCustParamUrl, getKeysAndValues } from './queryParamUrl';
import type {
	IDefaultAdvertising,
	IDefaultAdvertisingReturn,
	IJwAdschedule,
	TRollsHandler
} from './types';

export const createRollUrl = (scheduleUrl: string, keyValues: string, custParams: string) => {
	const decoded = decodeURIComponent(scheduleUrl);
	const removedCustParam =
		decoded.indexOf('&cust_params=') !== -1 ? decoded.split('&cust_params=')[0] : decoded;

	return `${removedCustParam.replace(/eb_anon_uuid_google/, window.eb_anon_uuid_google ?? '')}${keyValues}&cust_params=${encodeURIComponent(custParams)}`;
};

function createSchedule(scheduleObject: IJwAdschedule, keyValues: string, custParams: string) {
	if (scheduleObject && JSON.stringify(scheduleObject) !== '{}') {
		if (scheduleObject.schedule && typeof scheduleObject.schedule !== 'string') {
			const scheduleTags = scheduleObject.schedule[0].tag;
			if (typeof scheduleTags === 'string') {
				scheduleObject.schedule = createRollUrl(
					scheduleObject.schedule[0].tag as string,
					keyValues,
					custParams
				);
			}
		} else {
			scheduleObject.schedule = createRollUrl(
				scheduleObject.schedule as string,
				keyValues,
				custParams
			);
		}
		return scheduleObject;
	} else {
		return null;
	}
}

export async function rollsHandler(
	rollsHandlerObject: TRollsHandler,
	jwPlayerInstance: IJWPlayerInstance,
	playerElementId: string
): Promise<IDefaultAdvertisingReturn> {
	try {
		const {
			// actAsPlay,
			adscheduleId,
			adschedulePath,
			articleId,
			articleTypeName,
			autoplayAllowed,
			cookieless,
			creativeTimeout,
			disableRolls,
			inline,
			// isCtp,
			// isDiscovery,
			// isSmartphone,
			playerParent,
			requestTimeout,
			sectionPath,
			type,
			videoType
		} = rollsHandlerObject;

		if (disableRolls) {
			return {} as IDefaultAdvertisingReturn;
		}

		const isPlayVideo = false; // articleTypeName === 'article_video_standalone' && actAsPlay;
		console.log('sectionName', isPlayVideo);

		const sectionName = sectionPath.split('/')[1];
		console.log('sectionName', sectionName);
		console.log('cookieless', cookieless);
		// const group = 'article'; // getGroupName({ noConsent: cookieless, sectionName });

		const adscheduleFromJW = await getAdschedule({ adscheduleId, adschedulePath });

		const defaultAdvertising = (window as any).jwplayer.defaults.advertising ?? {};

		const scheduleObject = adscheduleFromJW
			? { ...defaultAdvertising, ...adscheduleFromJW, creativeTimeout, requestTimeout }
			: null;

		const custParams = await getCustParamUrl({
			articleId,
			articleTypeName,
			autoplayAllowed,
			inline,
			playerParent,
			sectionPath,
			type,
			videoType
		});

		const keyValues = await getKeysAndValues();

		let advertisingObject: Partial<IDefaultAdvertising> = {
			bids: {
				settings: {
					mediationLayerAdServer: 'dfp'
				}
			},
			client: 'googima',
			creativeTimeout,
			requestTimeout,
			skipoffset: 1,
			vpaidcontrols: true
		};

		const scheduleObjectAlter = createSchedule(scheduleObject, keyValues, custParams);
		if (scheduleObjectAlter) {
			advertisingObject = scheduleObjectAlter;
		}

		const advertisingOptions = {
			advertisingObject,
			scheduleObject,
			urlFragments: {
				custParams,
				keyValues,
				url: String(adscheduleFromJW?.schedule)
			}
		};

		if (!disableRolls) {
			if (advertisingObject && Object.keys(advertisingObject).length) {
				if (advertisingObject.schedule) {
					// Callback which performs header bidding.
					jwPlayerInstance.setPlaylistItemCallback(async (item: any) => {
						const tag = await getPrebidTag(
							advertisingObject.schedule as string,
							playerElementId,
							advertisingOptions
						);

						return Object.assign({}, item, {
							adschedule: [
								{
									offset: 'pre',
									tag
								}
							]
						});
					});
				}
			}
		}

		return advertisingOptions;
	} catch (error) {
		console.error({
			component: 'EBJW',
			label: 'rollsHandler',
			level: 'ERROR',
			message: (error as Error).message
		});
		return {
			advertisingObject: {}
		};
	}
}
