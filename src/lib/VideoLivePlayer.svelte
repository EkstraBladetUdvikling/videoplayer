<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import VideoLiveHandler from './videolivehandler';
	import type { IRollsHandlerReturn } from './rolls/rollshandler';

	const { jwMaxResolution, jwLibraryDNS, jwPlayerId } = page.data;

	interface VideoLivePlayerProps {
		advertisingObject?: IRollsHandlerReturn | undefined;
		channelId: string;
		floatingAllowed?: boolean;
		imageUrl?: string;
		vodAllowed?: boolean;
		vodFunction?: (channelId: string) => Promise<any[]>;
	}

	const {
		advertisingObject,
		channelId,
		floatingAllowed = false,
		imageUrl,
		vodAllowed = true,
		vodFunction
	}: VideoLivePlayerProps = $props();

	const device: string = 'desktop';

	let playerParent: HTMLDivElement;
	let playerElement: HTMLDivElement;
	const playerElementId = `jwVideo_${channelId}`;
	const placeholderImageId = `placeholderImage_${playerElementId}`;

	const placeholderImageUrl =
		imageUrl ??
		'https://img-cdn-p.ekstrabladet.dk/p-image/CE7lGN_O_oGUEoCHVy8Ka0GnU1whc2tvR4btehwUMRg/AAADM-kfFgA/ekstrabladet/10980641/relationBig_910/';

	onMount(() => {
		const video = {
			initObjectJW: {
				autoPause: true,
				disableRolls: !advertisingObject,
				// inline: false,
				// isLive: true,
				libraryDNS: jwLibraryDNS as string,
				// maxResolution: jwMaxResolution,
				playerElement,
				playerElementId,
				playerId: jwPlayerId,
				playerParent,
				isDrEdition: false,
				channelId,
				placeholderImageId,
				placeholderImageUrl,
				vodAllowed,
				vodFunction
			},
			autoPlayAllowed: true,
			floatingAllowed,
			rollsData: advertisingObject
		};
		console.log('video', video, advertisingObject);
		new VideoLiveHandler(video);
	});
</script>

<div bind:this={playerParent} id="videoPlayerParent" class="video-container {device.toLowerCase()}">
	<div bind:this={playerElement} id={playerElementId} class="video-container"></div>

	{#if placeholderImageUrl}
		<div id={placeholderImageId} class="image-container--landscape">
			<img alt="" loading="lazy" src={placeholderImageUrl} />
		</div>
	{/if}
</div>

<style>
	.video-container {
		aspect-ratio: 16/9;
	}

	.image-container--landscape {
		display: none;
		line-height: 0;
	}

	.image-container--landscape img {
		aspect-ratio: 16/9;

		width: 100%;
	}
</style>
