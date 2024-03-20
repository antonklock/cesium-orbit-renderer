<script lang="ts">
	import { onMount } from 'svelte';

	let imageUrls: string[] = [];

	const renderImage = (viewer: Viewer) => {
		if (imageUrls.length < 10) {
			viewer.render();
			imageUrls = [...imageUrls, viewer.canvas.toDataURL()];
			console.log(imageUrls);
		}
	};

	import {
		Ion,
		Cartesian3,
		Viewer,
		createGooglePhotorealistic3DTileset,
		HeadingPitchRange
	} from 'cesium';

	export let longitude = 12.0096;
	export let latitude = 57.6937;

	export let cesiumKey: string;

	onMount(async () => {
		window.CESIUM_BASE_URL = '/';
		Ion.defaultAccessToken = cesiumKey;

		// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
		const viewer = new Viewer('cesiumContainer', {
			// terrain: Terrain.fromWorldTerrain()
			globe: false
		});

		try {
			const tileset = await createGooglePhotorealistic3DTileset();
			viewer.scene.primitives.add(tileset);
		} catch (error) {
			console.log(`Failed to load tileset: ${error}`);
		}

		let heading = 0; //or any starting angle in radians
		let rotation = -1; //counter-clockwise; +1 would be clockwise
		let centre = Cartesian3.fromDegrees(longitude, latitude, 100);
		let elevation = 100; // 100 meters
		let pitch = -0.7854; //looking down at 45 degrees

		const SMOOTHNESS = 600; //it would make one full circle in roughly 600 frames

		viewer.clock.onTick.addEventListener(() => {
			heading += (rotation * Math.PI) / SMOOTHNESS;
			viewer.camera.lookAt(centre, new HeadingPitchRange(heading, pitch, elevation));
			// renderImage(viewer);
		});
		setTimeout(() => {
			setInterval(() => {
				// heading += (rotation * Math.PI) / SMOOTHNESS;
				// viewer.camera.lookAt(centre, new HeadingPitchRange(heading, pitch, elevation));
				renderImage(viewer);
			}, 100);
		}, 3000);
	});
</script>

<div id="cesiumContainer"></div>

{#if imageUrls.length > 0}
	<div class="container mx-auto">
		<div class="grid grid-cols-10 gap-4">
			{#each imageUrls as image}
				<!-- <p>{image}</p> -->
				<img src={image} alt="cesium" class="m-1 w-24" />
			{/each}
		</div>
	</div>
{/if}
