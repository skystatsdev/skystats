import { API_HOST_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { player } = params;

	const data = await fetch(`${API_HOST_URL}/player/${player}`).then((res) => res.json());

	if (!data) {
		throw error(404, 'Player not found!');
	}

	return {
		//! Temporary type information
		player: data as {
			uuid: string;
			username: string;
			skyblock: {
				profiles: {
					uuid: string;
					name: string;
				}[];
			};
		}
	};
}) satisfies LayoutServerLoad;
