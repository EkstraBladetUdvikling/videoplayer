export interface IJWPlayerInstance {
	getFloating: () => boolean;
	getMute: () => boolean;
	getPlaylistItem: () => any;
	getPlugin: (arg: string) => any;
	id: string;
	load: (playlist) => void;
	on: (ev: string, callback: (returnEvent) => void) => void;
	once: (ev: string, callback: (returnEvent) => void) => void;
	pause: () => void;
	play: () => void;
	playAd: (tag: string) => void;
	remove: () => void;
	setConfig: (options: any) => void;
	setFloating: (newStatus: boolean) => void;
	setPlaylistItemCallback: (arg) => void;
	setMute: (arg: boolean) => void;
	setup: (options: any) => void;
	stop: () => void;
}
