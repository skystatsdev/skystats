import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getPlayer } from '$api/hypixel';
import { testGetPlayer } from '$api/hypixel';

// GET /api/profiles/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const data = await getPlayer(id);

	if (!data) {
		throw error(404, 'Player has no SkyBlock profiles.');
	}

	return data;
};
