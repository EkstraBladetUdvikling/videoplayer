<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { rollsHandler } from '$lib/rolls/rollshandler';

	import VideoPlayer from '$lib/VideoPlayer.svelte';

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
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if browser}
	{#await rollsHandler(rollsOptions) then advertisingObject}
		<p>Rolls handler: {advertisingObject}</p>
		<VideoPlayer {advertisingObject} clipId="iUGkeCuC" />
	{:catch error}
		<p>Rolls handler error: {error.message}</p>
	{/await}
{/if}
