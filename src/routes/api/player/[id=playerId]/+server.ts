import type { RequestHandler } from './$types';
import { redis } from '$redis/connection';
import { IsIGN } from '$params/ign';
import { error, json } from '@sveltejs/kit';

// GET /api/player/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	if (IsIGN(id)) {
		const uuid = await redis.get(`ign:${id}`);

		if (!uuid) {
			throw error(404, `Player ${id} not found`);
		}

		return json({ id: uuid });
	}

	return json({ id });
};
