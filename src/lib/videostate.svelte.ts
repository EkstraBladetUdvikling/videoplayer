export class VideoState {
	floatingUsed: boolean = $state(false);
	players: HTMLDivElement[] = $state([]);
}

export const videoState = new VideoState();
