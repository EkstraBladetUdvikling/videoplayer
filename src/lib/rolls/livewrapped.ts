import { getPrebidTag } from './prebidtag';
import type { IUrlFragments, TRollsHandler } from './types';

export function liveWrapped(
	adUnitName: TRollsHandler['adUnitName'],
	jwPlayerInstance: jwplayer.JWPlayer,
	playerElementId: string,
	urlFragments: IUrlFragments
) {
	console.log('liveWrapped', adUnitName, jwPlayerInstance, playerElementId, urlFragments);
	if (adUnitName) {
		// Callback which performs header bidding.
		console.log('liveWrapped', adUnitName, jwPlayerInstance, playerElementId, urlFragments);
		jwPlayerInstance.setPlaylistItemCallback(async (item) => {
			const tag = await getPrebidTag(adUnitName, playerElementId, urlFragments);
			console.log('tag', tag);
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
