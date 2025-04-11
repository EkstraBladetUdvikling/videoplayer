export interface IAdvertisingUrlFragments {
	custParams: string;
	keyValues: string;
	url: string;
}

export type TAdScheduleOptions = Pick<TRollsHandler, 'adscheduleId' | 'adschedulePath'>;

export type TRollsHandler = {
	adscheduleId: string;
	adschedulePath: string;
	anonId: string;
	autoplayAllowed: boolean;
	creativeTimeout: number;
	custParams: string;
	isCtp: boolean;
	requestTimeout: number;
};

export interface IUrlFragments {
	custParams: string;
	keyValues: string;
	url: string;
}
