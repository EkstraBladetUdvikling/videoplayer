<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	const { jwMaxResolution, jwLibraryDNS, jwPlayerId } = page.data;

	const { clipId } = $props();

	const {
		allowFloating = true,
		caption = 'beskrivelse af video',
		title = 'Title'
	} = { allowFloating: true, caption: 'beskrivelse af video', title: 'Title' };

	const device: string = 'desktop';

	let playerParent: HTMLDivElement;
	let playerElement: HTMLDivElement;

	onMount(() => {
		const video = {
			initJWOptions: {
				allowFloating: true,
				articleId: '',
				autoPause: true,
				autoPlay: true,
				clipId,
				cookieless: false,
				duration: '200',
				environment: 'desktop',
				fetchPlaylist: false,
				imageUrl: 'string',
				inline: false,
				isDiscovery: false,
				isLive: false,
				isSmartphone: false,
				maxResolution: jwMaxResolution,
				playerElement,
				// playerElementId: string;
				playerParent,
				title: 'Title'
			},
			libraryDNS: jwLibraryDNS,
			playerId: jwPlayerId
		};
		console.log('video', video);
	});
</script>

<div bind:this={playerParent} id="videoPlayerParent" class="video-container {device.toLowerCase()}">
	<div bind:this={playerElement} class="video-container"></div>

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
