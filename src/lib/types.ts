import type { IRollsHandlerReturn } from './rolls/rollshandler';

interface JWEventData {
	created: string;
	id: string;
	last_modified: string;
	master_access: {
		expiration: string;
		status: string;
	};
	master_expiration: string;
	media_id: string;
	metadata: { [id: string]: unknown };
	published_at: string;
	schema: null;
	status: string;
	type: string;
}

export interface IJWLive {
	channelId: string;
	placeholderImageId: string;
	placeholderImageUrl: string;
	vodAllowed: boolean;
	vodFunction?: (channelId: string) => Promise<JWEventData[]>;
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
	disableRolls: boolean;
	// environment: 'prod' | 'staging' | 'dev';
	fetchPlaylist: boolean;
	floatingOptions?: IFloatingInitOptions;
	imageUrl: string;
	inline: boolean;
	isDiscovery: boolean;
	isDrEdition?: boolean;
	isLive: boolean;
	isSmartphone: boolean;
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
