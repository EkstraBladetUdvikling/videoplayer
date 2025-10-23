<script lang="ts">
	import AdInit from '@ekstra-bladet/display-ads/src/lib/AdInit.svelte';

	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { rollsHandler } from '$lib/rolls/rollshandler';

	import VideoPlayer from '$lib/VideoPlayer.svelte';
	import { setContext } from 'svelte';
	import VideoLivePlayer from '$lib/VideoLivePlayer.svelte';
	import { getSiteChannelsEvents } from '$lib/fetchEvents';

	// Desktop: F5LFDuhS
	// Mobil: KKxlzvl5

	const rollsOptions = {
		adscheduleId: 'F5LFDuhS',
		adschedulePath: 'https://cdn.jwplayer.com/v2/advertising/schedules/',
		anonId: 'anonId',
		autoplayAllowed: true,
		creativeTimeout: 6000,
		custParams: '',
		isCtp: true,
		requestTimeout: 6000
	};

	afterNavigate(async () => {
		if (browser) {
			const adv = await rollsHandler(rollsOptions); // , jwPlayerInstance, playerElementId);
			console.log('adv', adv);
		}
	});

	setContext('consent', () => {
		return true;
	});

	const floatingAllowed = true;
</script>

<AdInit />

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<!-- <div style="height: 1200px; background: purple;"></div> -->
<!-- <div style="min-height: 30px; background: lightgray;">
	<VideoLivePlayer channelId="2JEV4cpt" {floatingAllowed} />
</div> -->
<div style="min-height: 30px; background: rosa;">
	<VideoLivePlayer channelId="rOcitXGI" {floatingAllowed} vodFunction={getSiteChannelsEvents} />
</div>
<!-- {#if browser}
	{#await rollsHandler(rollsOptions) then advertisingObject}
		<p>Rolls handler: {advertisingObject}</p>
		<VideoPlayer {advertisingObject} clipId="iUGkeCuC" {floatingAllowed} />
	{:catch error}
		<p>Rolls handler error: {error.message}</p>
	{/await}
{/if} -->
<!-- <div style="height: 1200px; background: pink;"></div> -->
