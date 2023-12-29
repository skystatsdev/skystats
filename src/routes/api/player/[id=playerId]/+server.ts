import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { FetchPlayerData } from '$api/hypixel';

// GET /api/player/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const data = await FetchPlayerData(id);

	if (!data) {
		throw error(404, 'Player not found!');
	}

	return json(data);
};
