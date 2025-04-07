interface IVideoState {
	floatingUsed: boolean;
	players: HTMLDivElement[];
}
export const videoState: IVideoState = {
	floatingUsed: $state(false),
	players: $state([])
};
