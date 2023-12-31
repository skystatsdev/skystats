import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getProfiles } from '$api/hypixel';

// GET /api/profiles/[id=playerId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	const profiles = await getProfiles(id);

	if (!profiles) {
		throw error(404, 'Profiles not found!');
	}

	return json(profiles);
};
