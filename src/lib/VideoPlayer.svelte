<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import VideoHandler from './videohandler';
	import type { IRollsHandlerReturn } from './rolls/rollshandler';

	const { jwMaxResolution, jwLibraryDNS, jwPlayerId } = page.data;

	interface VideoPlayerProps {
		advertisingObject: IRollsHandlerReturn | null;
		clipId: string;
		floatingAllowed?: boolean;
	}

	const { advertisingObject, clipId, floatingAllowed = false }: VideoPlayerProps = $props();

	const device: string = 'desktop';

	let playerParent: HTMLDivElement;
	let playerElement: HTMLDivElement;
	const playerElementId = `jwVideo_${clipId}`;

	onMount(() => {
		const video = {
			initObjectJW: {
				articleId: '',
				// autoPause: true,
				clipId,
				disableRolls: !advertisingObject,
				duration: '200',
				fetchPlaylist: false,
				imageUrl: 'string',
				inline: false,
				isDiscovery: false,
				isLive: false,
				libraryDNS: jwLibraryDNS,
				maxResolution: jwMaxResolution,
				playerElement,
				playerElementId,
				playerId: jwPlayerId,
				playerParent,
				title: 'Title',
				isSmartphone: device === 'smartphone'
			},
			autoPlayAllowed: false,
			floatingAllowed,
			rollsData: advertisingObject
		};
		console.log('video', video, advertisingObject);
		new VideoHandler(video);
	});
</script>

<div bind:this={playerParent} id="videoPlayerParent" class="video-container {device.toLowerCase()}">
	<div bind:this={playerElement} id={playerElementId} class="video-container"></div>

	<!-- {#if liveChannelId && imageUrl}
		<div id="placeholderImage_{playerId}" class="image-container--landscape">
			<img alt="" loading="lazy" src={imageUrl} class="width-1of1 image-container-img" />
		</div>
	{/if} -->
</div>
