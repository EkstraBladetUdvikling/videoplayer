import type { IRollsHandlerReturn } from './rolls/rollshandler';

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
	environment: 'prod' | 'staging' | 'dev';
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
	title: string;
	volume: number;
	libraryDNS: string;
	playerId: string;
	rollsData: IRollsHandlerReturn | null;
}

type IFloatingOptions = Pick<IInitJWOptions, 'playerParent'> & IFloatingInitOptions;

export interface IFloatingPlayerOptions extends IFloatingOptions {
	jwPlayerInstance: jwplayer.JWPlayer;
	playerElementId: string;
}

export interface IMessageOptions {
	inline: boolean;
	playerElement: HTMLDivElement;
	playerParent: HTMLDivElement;
	type: string;
}

export interface ISetupJWOptions extends IInitJWOptions {
	autoplayAllowed: boolean;
}
