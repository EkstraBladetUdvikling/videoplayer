<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import VideoLiveHandler from './videolivehandler';
	import type { IRollsHandlerReturn } from './rolls/rollshandler';

	const { jwLibraryDNS, jwPlayerId } = page.data;

	interface VideoLivePlayerProps {
		advertisingObject?: IRollsHandlerReturn;
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

	const placeholderImageUrl = imageUrl ?? '';

	onMount(() => {
		const video = {
			initObjectJW: {
				autoPause: true,
				disableRolls: !advertisingObject,
				libraryDNS: jwLibraryDNS as string,
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
			rollsData: advertisingObject ?? null
		};

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
