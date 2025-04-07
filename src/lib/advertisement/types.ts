import type { IInitJWOptions, IRollOptions } from '../types';

export interface IJwAdschedule {
  adscheduleid: string;
  client: string;
  rules: { startOnSeek: string; timeBetweenAds: number };
  schedule:
    | string
    | [
        {
          tag: string | string[];
          type: string;
          offset: string;
        },
      ];
  vpaidmode: string;
}

export interface IAdvertisingUrlFragments {
  custParams: string;
  keyValues: string;
  url: string;
}

export interface IDefaultAdvertisingReturn {
  advertisingObject: Partial<IDefaultAdvertising>;
  urlFragments?: IAdvertisingUrlFragments;
  scheduleObject?: IJwAdschedule;
}

export interface IDefaultAdvertising extends IJwAdschedule {
  admessage: string;
  bids: { settings: { mediationLayerAdServer: string } };
  creativeTimeout: string;
  cuetext: string;
  outstream: boolean;
  preloadAds: boolean;
  requestTimeout: string;
  skipoffset: number;
  skipmessage: string;
  tag: string;
  vpaidcontrols: boolean;
}

export type TAdScheduleOptions = Pick<IRollOptions, 'adscheduleId' | 'adschedulePath'>;

export type TRollsHandler = IRollOptions &
  Pick<
    IInitJWOptions,
    'actAsPlay' | 'articleId' | 'cookieless' | 'inline' | 'isDiscovery' | 'isSmartphone' | 'playerParent'
  > & {
    autoplayAllowed: boolean;
    isCtp: boolean;
  };

export type TCustomParamInfo = Pick<IInitJWOptions, 'articleId' | 'inline' | 'playerParent'> &
  Pick<IRollOptions, 'articleTypeName' | 'sectionPath' | 'type' | 'videoType'> & {
    autoplayAllowed: boolean;
  };
