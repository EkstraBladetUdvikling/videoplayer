import { getAdschedule } from './adschedulehandler';
import { createSchedule } from './createrollurl';

import type { IUrlFragments, TRollsHandler } from './types';

export interface IRollsHandlerReturn {
	adUnitName: TRollsHandler['adUnitName'];
	advertisingObject: Partial<jwplayer.AdvertisingConfig>;
	urlFragments: IUrlFragments;
}

export async function rollsHandler(
	rollsHandlerObject: TRollsHandler
): Promise<IRollsHandlerReturn | null> {
	try {
		const {
			adscheduleId,
			adschedulePath,
			adUnitName,
			anonId,
			creativeTimeout,
			custParams,
			requestTimeout
		} = rollsHandlerObject;

		const adscheduleFromJW = await getAdschedule({ adscheduleId, adschedulePath });

		const defaultAdvertising = window.jwplayer?.defaults.advertising ?? {};

		const scheduleObject = adscheduleFromJW
			? { ...defaultAdvertising, ...adscheduleFromJW, creativeTimeout, requestTimeout }
			: null;

		const keyValues = `&eids=jppol.dk,${anonId}`;

		let advertisingObject: Partial<jwplayer.AdvertisingConfig> = {
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

		console.log('equal?', JSON.stringify(advertisingObject) === JSON.stringify(scheduleObject));

		return {
			adUnitName,
			advertisingObject,
			urlFragments: { custParams, keyValues, url: String(adscheduleFromJW?.schedule) }
		};
	} catch (error) {
		console.error({
			component: 'EBJW',
			label: 'rollsHandler',
			level: 'ERROR',
			message: (error as Error).message
		});
		return null;
	}
}
