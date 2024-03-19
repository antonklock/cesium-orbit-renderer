<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { cesiumKey } = data;

	import { onMount } from 'svelte';

	import {
		Ion,
		Cartesian3,
		Math as CesiumMath,
		Terrain,
		Viewer,
		createGooglePhotorealistic3DTileset
	} from 'cesium';
	import 'cesium/Build/Cesium/Widgets/widgets.css';

	//@ts-ignore
	import domtoimage from 'dom-to-image';

	let imageUrl = '';

	onMount(async () => {
		window.CESIUM_BASE_URL = '/';
		Ion.defaultAccessToken = cesiumKey;

		// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
		const viewer = new Viewer('cesiumContainer', {
			// terrain: Terrain.fromWorldTerrain()
			globe: false
		});

		// Fly the camera to San Francisco at the given longitude, latitude, and height.
		viewer.camera.flyTo({
			destination: Cartesian3.fromDegrees(12.0096, 57.6937, 200),
			orientation: {
				heading: CesiumMath.toRadians(0.0),
				pitch: CesiumMath.toRadians(-40.0)
			}
		});

		viewer.camera.lookAt(
			Cartesian3.fromDegrees(12.0096, 57.6937, 200),
			Cartesian3.fromDegrees(1000, 1000, 1000)
		);

		// viewer.camera.position = Cartesian3.fromDegrees(12.0096, 57.6937, 400);

		try {
			const tileset = await createGooglePhotorealistic3DTileset();
			viewer.scene.primitives.add(tileset);
		} catch (error) {
			console.log(`Failed to load tileset: ${error}`);
		}

		// viewer.camera.lookDown(0.2);

		setInterval(() => {
			viewer.camera.rotate(Cartesian3.fromDegrees(0, 90, 0), -0.1);
		}, 100);

		// setTimeout(() => {
		// 	viewer.camera.flyTo({
		// 		destination: Cartesian3.fromDegrees(500.4175, 37.655, 1000),
		// 		orientation: {
		// 			heading: CesiumMath.toRadians(100.0),
		// 			pitch: CesiumMath.toRadians(-25.0)
		// 		}
		// 	});
		// }, 5000);
		// setTimeout(() => {
		// 	viewer.camera.flyTo({
		// 		destination: Cartesian3.fromDegrees(500.4175, 37.655, 1000),
		// 		orientation: {
		// 			heading: CesiumMath.toRadians(100.0 + 40),
		// 			pitch: CesiumMath.toRadians(-25.0)
		// 		}
		// 	});
		// }, 100);

		setTimeout(() => {
			const element = document.getElementById('cesiumContainer');
			if (element)
				domtoimage.toJpeg(element, { quality: 0.9 }).then(function (dataUrl: string) {
					imageUrl = dataUrl;
				});
		}, 5000);
	});
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div id="cesiumContainer"></div>
<img src={imageUrl} alt="cesium" />
