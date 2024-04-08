<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { cesiumKey } = data;

	import { onMount } from 'svelte';

	import {
		Ion,
		Cartesian3,
		Viewer,
		createGooglePhotorealistic3DTileset,
		HeadingPitchRange
	} from 'cesium';
	import 'cesium/Build/Cesium/Widgets/widgets.css';
	import Cesium from '$lib/components/cesium.svelte';

	let renderCesium = false;
	let longitude = 12.0096;
	let latitude = 57.6937;
</script>

<div class="flex flex-col h-screen justify-center items-center">
	{#if renderCesium}
		<div class="w-full">
			<button
				class="bg-red-800 py-3 px-8 rounded-md mt-4"
				on:click={() => (renderCesium = !renderCesium)}>Stop</button
			>
			<!-- <div id="cesiumContainer" class="w-1/2"></div> -->
			<Cesium {longitude} {latitude} {cesiumKey} />
		</div>
	{:else}
		<div class="flex flex-col">
			<p>Longitude</p>
			<input type="number" class="m-1" bind:value={longitude} />
			<p>Latitude</p>
			<input type="number" class="m-1" bind:value={latitude} />
		</div>

		<button
			class="bg-lime-500 py-3 px-8 rounded-md mt-4"
			on:click={() => {
				renderCesium = !renderCesium;
			}}>Start</button
		>
	{/if}
</div>
