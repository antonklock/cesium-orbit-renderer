import type { PageServerLoad } from './$types';
import { VITE_CESIUM } from '$env/static/private';

export const load = (async () => {
    const cesiumKey = VITE_CESIUM;
    return {
        cesiumKey,
    };
}) satisfies PageServerLoad;