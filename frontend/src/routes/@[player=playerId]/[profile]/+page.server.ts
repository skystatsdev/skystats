import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_HOST_URL } from '$env/static/private';
import type { SkyblockProfile } from '$types';

export const load = (async ({ params, fetch }) => {
	const { player, profile } = params;

	const profilesReq = await fetch(`${API_HOST_URL}/player/${player}/${profile}`);

	if (profilesReq.status !== 200) {
		throw error(profilesReq.status, 'Profiles not found');
	}

	//! Very temporary type information
	const data = (await profilesReq.json()) as SkyblockProfile;

	return data;
}) satisfies PageServerLoad;
