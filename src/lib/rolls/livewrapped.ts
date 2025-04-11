import { getPrebidTag } from './prebidtag';
import type { IUrlFragments } from './types';

export function liveWrapped(
	advertisingObject: Partial<jwplayer.AdvertisingConfig> | undefined,
	jwPlayerInstance: jwplayer.JWPlayer,
	playerElementId: string,
	urlFragments: IUrlFragments | undefined
) {
	if (advertisingObject && advertisingObject.schedule) {
		// Callback which performs header bidding.
		console.log(
			'liveWrapped',
			advertisingObject.schedule,
			jwPlayerInstance,
			playerElementId,
			urlFragments
		);
		jwPlayerInstance.setPlaylistItemCallback(async (item) => {
			const tag = await getPrebidTag(
				advertisingObject.schedule as string,
				playerElementId,
				urlFragments
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
