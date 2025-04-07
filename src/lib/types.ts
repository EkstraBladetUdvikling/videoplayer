import type { ENVIRONMENT } from 'frontend/shared/util/environment';
import type { TRollsHandler } from './advertisement/types';

export interface IEBjwLive {
	channelId: string;
	libraryDNS: string;
	placeholderImageId: string;
	placeholderImageUrl: string;
	propertyId: string;
	vodAllowed: boolean;
}

export interface IRollOptions {
	adscheduleId: string;
	adschedulePath: string;
	articleTypeName: string;
	creativeTimeout: string;
	disableRolls: boolean;
	requestTimeout: string;
	sectionPath: string;
	type: string;
	videoType: string;
}

interface IFloatingInitOptions {
	articleTitleLength: number;
	floatAllowed: boolean;
}

export interface IInitJWOptions {
	// actAsPlay: boolean;
	allowFloating: boolean;
	articleId: string;
	autoPause: boolean;
	autoPlay: boolean;
	clipId: string;
	cookieless: boolean;
	duration: string;
	environment: ENVIRONMENT;
	fetchPlaylist: boolean;
	floatingOptions?: IFloatingInitOptions;
	imageUrl: string;
	inline: boolean;
	isDiscovery: boolean;
	isDrEdition?: boolean;
	isLive: boolean;
	isSmartphone: boolean;
	liveOptions?: IEBjwLive;
	maxResolution: string;
	playerElement: HTMLDivElement;
	playerElementId: string;
	playerParent: HTMLDivElement;
	recommendationId?: string;
	rollOptions: IRollOptions;
	title: string;
	volume: number;
	libraryDNS: string;
	playerId: string;
}

export interface IJWVideoOptions {
	initJWOptions: Partial<IInitJWOptions>;
	libraryDNS: string;
	playerId: string;
}

interface IJWautoPause {
	pauseAds?: boolean;
	viewability?: boolean;
}

export interface IJWPlayerConfig {
	advertising: any;
	aspectratio?: string;
	autoPause: IJWautoPause;
	autostart: string | boolean;
	controls?: boolean;
	displaydescription?: boolean;
	displaytitle?: boolean;
	doNotSaveCookies: boolean;
	file: string;
	floating: any;
	image: string;
	mute: boolean;
	playlist: any;
	preload: string;
	related: any;
	repeat: boolean;
	volume: number;
}

type IFloatingOptions = Pick<IInitJWOptions, 'isSmartphone' | 'playerParent'> &
	IFloatingInitOptions;

export interface IFloatingPlayerOptions extends IFloatingOptions {
	jwPlayerInstance: any;
	playerElementId: string;
}

export interface IMessageOptions {
	inline: boolean;
	playerElement: HTMLDivElement;
	playerParent: HTMLDivElement;
	type: string;
}

export interface ISetupJWOptions extends IInitJWOptions {
	rollsObject: TRollsHandler;
}
