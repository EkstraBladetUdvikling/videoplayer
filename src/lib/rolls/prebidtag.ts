import { createRollUrl } from './createrollurl';
import type { IUrlFragments } from './types';

const performAsyncBidding = async (adUnitName: string, tagId: string) => {
	return new Promise((resolve) => {
		// Livewrapped will run the auction. Once the auction has run,
		// the video.callback will be called with a video url as a parameter
		window.lwhb.loadAd({
			adUnitName,
			tagId,
			video: {
				// The video url created by pbjs.adServers.dfp.buildVideoUrl will be passed
				// to resolve below
				callback: resolve,
				// Optionally create the params that will be passed to pbjs.adServers.dfp.buildVideoUrl.
				// Parameters that Prebid needs are passed as parameters.
				// gamAdUnit is taken from the placement defined in the Livewrapped console.
				paramsFn: (prebidAdUnit: string, gamAdUnit: string) => {
					return {
						adUnit: prebidAdUnit,
						params: {
							iu: gamAdUnit,
							output: 'vast'
						}
					};
				}
			}
		});
	}).then((videoUrl) => {
		return videoUrl;
	});
};

// Timeout in case Livewrapped doesn't load.
const FAILSAFE_TIMEOUT = 3000;

export async function getPrebidTag(
	tag: string,
	playerElementId: string,
	urlFragments: IUrlFragments
) {
	const extractedAdUnitName = tag.match(/iu=\/\d+\/ekstra_bladet\/(.*?)\/(.*?)&/);
	const adUnitName =
		extractedAdUnitName && extractedAdUnitName[2]
			? extractedAdUnitName[2].replace('eb_', 'ekstra_bladet_')
			: '';

	// Resolve when Livewrapped handles queue, otherwise timeout.
	const pbjsLoaded = new Promise((resolve, reject) => {
		window.lwhb.cmd.push(resolve);
		setTimeout(reject, FAILSAFE_TIMEOUT);
	});

	if (!window.lwhb) return;

	return pbjsLoaded // Wait until Livewrapped is loaded.
		.then(() => performAsyncBidding(adUnitName, playerElementId)) // Run auction.
		.then(async (lwhbRollTag: unknown) => {
			// Update the playlist item.
			const hbData = (lwhbRollTag as string).match(/\?(?:[^&]*&)*(cust_params)=([^&]+)/);

			const hbParams = hbData && hbData[2] ? decodeURIComponent(hbData[2]) : '';

			if (urlFragments) {
				const { custParams, keyValues, url } = urlFragments;

				const rollTag = createRollUrl({
					scheduleUrl: url,
					keyValues,
					custParams: `${custParams}&${hbParams}`
				});

				return rollTag;
			}
		})
		.catch(() => null);
}
