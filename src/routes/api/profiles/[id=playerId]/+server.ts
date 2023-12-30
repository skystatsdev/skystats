import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getPlayer, getProfiles } from '$api/hypixel';
import { getStats } from '$lib/stats';

// GET /api/profiles/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const { profile, profiles, uuid } = await getProfiles(id);
	if (profile === undefined) {
		return error(404, 'Player has no profiles.');
	}

	const player = await getPlayer(uuid);
	if (player === undefined) {
		return error(404, 'Player not found.');
	}

	const data = getStats(profile, player, uuid);
	if (data === undefined) {
		return error(404, 'Failed to process profile.');
	}

	return json(data);
};
