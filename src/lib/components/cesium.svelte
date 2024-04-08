<script lang="ts">
	import { onMount } from 'svelte';

	let imageUrls: string[] = [];
	let displayImage: number = 0;

	const renderImage = (viewer: Viewer) => {
		if (imageUrls.length < 180) {
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

		const SMOOTHNESS = 360; //it would make one full circle in roughly 180 frames

		heading += (rotation * Math.PI) / SMOOTHNESS;
		viewer.camera.lookAt(centre, new HeadingPitchRange(heading, pitch, elevation));

		function renderAndRotate(SMOOTHNESS: number) {
			heading += (rotation * Math.PI) / SMOOTHNESS;
			viewer.camera.lookAt(centre, new HeadingPitchRange(heading, pitch, elevation));
			viewer.render();
			imageUrls = [...imageUrls, viewer.canvas.toDataURL('image/jpeg', 0.5)];

			if (imageUrls.length < SMOOTHNESS * 2) {
				renderAndRotate(SMOOTHNESS);
			}
		}

		setTimeout(() => {
			renderAndRotate(360);
		}, 3000);

		setInterval(() => {
			if (imageUrls.length > 0) {
				displayImage = (displayImage + 1) % imageUrls.length;
				console.log(displayImage);
				// console.log(imageUrls.length);
			}
		}, 40);
	});
</script>

<div id="cesiumContainer"></div>

{#if imageUrls.length > 0}
	<div class="container mx-auto">
		<img src={imageUrls[displayImage]} alt="cesium" class="m-1 w-1/2" />
		<div class="grid grid-cols-10 gap-4"></div>
	</div>
{/if}

<!-- {#each imageUrls as image}
				<img src={image} alt="cesium" class="m-1 w-24" />
			{/each} -->
