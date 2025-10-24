export const getFloatingPlayer = (floatAllowed: boolean): jwplayer.FloatingConfig | undefined =>
	!floatAllowed
		? undefined
		: {
				dismissible: false
			};
