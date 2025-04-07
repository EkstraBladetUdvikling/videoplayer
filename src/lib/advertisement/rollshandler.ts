import { getGroupName } from 'frontend/js-admanager/src';

import { getAdschedule } from './adschedulehandler';
import { getAdScheduleId } from './getAdScheduleId';
import { getCustParamUrl, getKeysAndValues } from './queryParamUrl';
import type { IDefaultAdvertising, IDefaultAdvertisingReturn, IJwAdschedule, TRollsHandler } from './types';

export const createRollUrl = (scheduleUrl: string, keyValues: string, custParams: string) => {
  const decoded = decodeURIComponent(scheduleUrl);
  const removedCustParam = decoded.indexOf('&cust_params=') !== -1 ? decoded.split('&cust_params=')[0] : decoded;

  return `${removedCustParam.replace(/eb_anon_uuid_google/, window.eb_anon_uuid_google ?? '')}${keyValues}&cust_params=${encodeURIComponent(custParams)}`;
};

function createSchedule(scheduleObject: IJwAdschedule, keyValues: string, custParams: string) {
  if (scheduleObject && JSON.stringify(scheduleObject) !== '{}') {
    if (scheduleObject.schedule && typeof scheduleObject.schedule !== 'string') {
      const scheduleTags = scheduleObject.schedule[0].tag;
      if (typeof scheduleTags === 'string') {
        scheduleObject.schedule = createRollUrl(scheduleObject.schedule[0].tag as string, keyValues, custParams);
      }
    } else {
      scheduleObject.schedule = createRollUrl(scheduleObject.schedule as string, keyValues, custParams);
    }
    return scheduleObject;
  } else {
    return null;
  }
}

export async function rollsHandler(rollsHandlerObject: TRollsHandler): Promise<IDefaultAdvertisingReturn> {
  try {
    const {
      actAsPlay,
      adschedulePath,
      articleId,
      articleTypeName,
      autoplayAllowed,
      cookieless,
      creativeTimeout,
      disableRolls,
      inline,
      isCtp,
      isDiscovery,
      isSmartphone,
      playerParent,
      requestTimeout,
      sectionPath,
      type,
      videoType,
    } = rollsHandlerObject;

    let { adscheduleId } = rollsHandlerObject;

    if (disableRolls) {
      return {} as IDefaultAdvertisingReturn;
    }

    const isPlayVideo = articleTypeName === 'article_video_standalone' && actAsPlay;

    const sectionName = sectionPath.split('/')[1];
    const group = getGroupName({ noConsent: cookieless, sectionName });
    const { adscheduleId: overrideAdschedule } = getAdScheduleId(group, isSmartphone, isPlayVideo, isDiscovery, isCtp);

    adscheduleId = overrideAdschedule;

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
      videoType,
    });

    const keyValues = await getKeysAndValues();

    let advertisingObject: Partial<IDefaultAdvertising> = {
      bids: {
        settings: {
          mediationLayerAdServer: 'dfp',
        },
      },
      client: 'googima',
      creativeTimeout,
      requestTimeout,
      skipoffset: 1,
      vpaidcontrols: true,
    };

    const scheduleObjectAlter = createSchedule(scheduleObject, keyValues, custParams);
    if (scheduleObjectAlter) {
      advertisingObject = scheduleObjectAlter;
    }

    return {
      advertisingObject,
      scheduleObject,
      urlFragments: {
        custParams,
        keyValues,
        url: String(adscheduleFromJW?.schedule),
      },
    };
  } catch (error) {
    window.ebLog({
      component: 'EBJW',
      label: 'rollsHandler',
      level: 'ERROR',
      message: (error as Error).message,
    });
    return {
      advertisingObject: {},
    };
  }
}
