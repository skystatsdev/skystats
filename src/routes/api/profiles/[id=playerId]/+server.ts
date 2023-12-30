import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { getProfile } from '$api/hypixel';

// GET /api/profiles/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const data = await getProfile(id);

	if (!data) {
		throw error(404, 'Player has no SkyBlock profiles.');
	}

	return json(data);
};
