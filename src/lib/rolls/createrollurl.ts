export interface ICreateRollUrl {
	custParams: string;
	keyValues: string;
	replaceOptions?: {
		[key: string]: string;
	};
	scheduleUrl: string;
}

export const createRollUrl = (rollUrlOptions: ICreateRollUrl) => {
	const { custParams, keyValues, replaceOptions, scheduleUrl } = rollUrlOptions;
	const decoded = decodeURIComponent(scheduleUrl);
	let removedCustParam =
		decoded.indexOf('&cust_params=') !== -1 ? decoded.split('&cust_params=')[0] : decoded;

	Object.keys(replaceOptions ?? {}).forEach((key) => {
		if (!key || !replaceOptions) return;
		removedCustParam = removedCustParam.replace(key, replaceOptions[key]);
	});

	return `${removedCustParam}${keyValues}&cust_params=${encodeURIComponent(custParams)}`;
};

export function createSchedule(
	scheduleObject: jwplayer.AdvertisingConfig,
	keyValues: string,
	custParams: string
) {
	if (scheduleObject && JSON.stringify(scheduleObject) !== '{}') {
		if (scheduleObject.schedule && typeof scheduleObject.schedule !== 'string') {
			const scheduleTags = scheduleObject.schedule[0].tag;
			if (typeof scheduleTags === 'string') {
				scheduleObject.schedule = createRollUrl({
					custParams,
					keyValues,
					scheduleUrl: scheduleObject.schedule[0].tag as string
				});
			}
		} else {
			scheduleObject.schedule = createRollUrl({
				custParams,
				keyValues,
				scheduleUrl: scheduleObject.schedule as string
			});
		}
		return scheduleObject;
	} else {
		return null;
	}
}
