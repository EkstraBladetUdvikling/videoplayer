import { getKeyValues } from '@ekstra-bladet/display-ads/src/lib/util/getkeyvalues';

import type { TCustomParamInfo } from './types';

export async function getCustParamUrl(customParamInfo: TCustomParamInfo): Promise<string> {
	try {
		//  Ensure we have consent data available for roll handling
		(window as any).__tcfapi('getTCData', 2, (data: any) => {
			(window as any).GDPR_CONSENT_STRING = data.tcString;
		});

		const {
			articleId,
			autoplayAllowed,
			inline,
			playerParent,
			sectionPath,
			userType = '',
			videoType
		} = customParamInfo;

		const relevanceContext = window.relevance_context;
		const ebBanners = window.ebComponents.ebBanners;
		const globalSegments = window.eb_segments || [];
		let custParams = '';

		if (ebBanners && playerParent) {
			const kvFromPath = getKeyValues
				? [...getKeyValues(sectionPath, 'article'), articleId].join(',')
				: '';

			const pp_audiences = globalSegments;
			if (kvFromPath) custParams += `&ekstra_bladet=${kvFromPath}`;
			if (userType) custParams += `&userType=${userType}`;
			if (globalSegments) custParams += `&Relevance_Audiences=${globalSegments}`;
			if (pp_audiences) custParams += `&pp_audiences=${pp_audiences}`;
			if (relevanceContext) custParams += `&Relevance_Context=${relevanceContext.join(',')}`;
			if (videoType) {
				custParams += `&Video=${videoType === 'standalonevideo' ? 'Standalone' : 'Standard'}`;
				custParams += `,${inline ? 'placement_bottom' : 'placement_top'}`;
			}
			custParams += `&vwidth=${playerParent.offsetWidth}&vheight=${playerParent.offsetHeight}`;
			custParams += `&vpa=${autoplayAllowed ? 'auto' : 'click'}`;
		}

		return custParams;
	} catch (err) {
		console.error({
			component: 'EBJW',
			label: 'getCustParamUrl',
			level: 'ERROR',
			message: (err as Error).message
		});
		return '';
	}
}

export const getKeysAndValues = async () => {
	const kvRes = `&eids=jppol.dk,${window.eb_anon_uuid_adform}`;
	return kvRes;
};

export const changeVPAValue = (cust_params: string, vpa = 'click') => {
	window.ebComponents.ebBanners.updateORTBData({ vpa });
	return cust_params.replace(/vpa=[^&]+/, `vpa=${vpa}`);
};
