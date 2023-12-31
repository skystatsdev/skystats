import { getProfileMember, getProfiles } from '$api/hypixel';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { id, profile: profileId } = params;

	const profiles = await getProfiles(id);

	const selected =
		profileId.toLowerCase() === 'selected'
			? profiles.find((p) => p.selected)
			: profiles.find((p) => p.cuteName.toUpperCase() === profileId.toUpperCase() || p.id === profileId);

	if (!selected) {
		throw error(404, 'Profile not found!');
	}

	const member = await getProfileMember(id, selected.id);

	if (!member) {
		throw error(404, 'Profile member not found!');
	}

	return json(member);
};
