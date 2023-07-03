import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_HOST_URL } from '$env/static/private';

export const load = (async ({ params, fetch, parent }) => {
	const { player } = await parent();
	const { profile } = params;

	const profilesReq = await fetch(`${API_HOST_URL}/player/${player.uuid}/${profile}`);

	if (profilesReq.status !== 200) {
		throw error(profilesReq.status, 'Profiles not found');
	}

	//! Very temporary type information
	const data = (await profilesReq.json()) as {
		profile: {
			uuid: string;
			members: {
				uuid: string;
				username: string;
			}[];
		};
		profile_name: string;
		skyblock_level: number;
		fairy_souls: number;
		player: {
			uuid: string;
			username: string;
		skills: {
			[name: string]: {
				xp: number;
				level: number;
				max_level: number;
				xp_current: number;
				xp_for_next: number;
				progress: number;
				level_cap: number;
				uncapped_level: number;
				level_with_progress: number;
				uncapped_level_with_progress: number;
			};
		};
	};

	return {
		profile: data
	};
}) satisfies PageServerLoad;
