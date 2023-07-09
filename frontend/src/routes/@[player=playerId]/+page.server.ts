import { API_HOST_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const { player } = params;

	const data = await fetch(`${API_HOST_URL}/player/${player}`).then((res) => res.json());

	if (!data) {
		throw error(404, 'Player not found!');
	}

	const { selected_profile: selected_profile_id } = data.skyblock;
	const selected_profile_cute_name = data.skyblock.profiles.find(
		(profile: { uuid: string; name: string }) => profile.uuid === selected_profile_id
	).name;

	throw redirect(301, `/@${player}/${selected_profile_cute_name}`);
}) satisfies PageServerLoad;
