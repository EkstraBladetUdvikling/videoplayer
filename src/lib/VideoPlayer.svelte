<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import VideoHandler from '$lib';
	import type { IRollsHandlerReturn } from './rolls/rollshandler';

	const { jwMaxResolution, jwLibraryDNS, jwPlayerId } = page.data;

	interface VideoPlayerProps {
		advertisingObject: IRollsHandlerReturn | null;
		clipId: string;
		floatingAllowed?: boolean;
	}

	const { advertisingObject, clipId, floatingAllowed = false }: VideoPlayerProps = $props();

	const {
		allowFloating = true,
		caption = 'beskrivelse af video',
		title = 'Title'
	} = { allowFloating: true, caption: 'beskrivelse af video', title: 'Title' };

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
				title: 'Title'
			},
			autoPlayAllowed: false,
			disableRolls: false,
			floatingAllowed,
			rollsData: advertisingObject
		};
		console.log('video', video, advertisingObject);
		new VideoHandler(video);
	});
</script>

<div bind:this={playerParent} id="videoPlayerParent" class="video-container {device.toLowerCase()}">
	<div bind:this={playerElement} id={playerElementId} class="video-container"></div>

	{#if allowFloating && device !== 'smartphone'}
		<div class="jw-floating-container">
			<h1 class="jw-floating-title margin-l fontsize-xxlarge">{title}</h1>
		</div>
	{/if}
	<!-- {#if liveChannelId && imageUrl}
		<div id="placeholderImage_{playerId}" class="image-container--landscape">
			<img alt="" loading="lazy" src={imageUrl} class="width-1of1 image-container-img" />
		</div>
	{/if} -->
</div>
{#if caption}
	<div class="figure-caption grid-column fs-caption padding-xl--rl padding-m--tb">
		{caption}
	</div>
{/if}
