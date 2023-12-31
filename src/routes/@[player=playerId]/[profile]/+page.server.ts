import { getProfileMember } from '$api/hypixel';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { profile } = params;
	const { profiles, account } = await parent();

	const selected =
		profiles.find((p) => p.cuteName?.toUpperCase() === profile.toUpperCase() || p.id === profile) ?? profiles[0];

	const member = await getProfileMember(account.id, selected.id);

	if (!member) {
		throw error(404, 'Profile member not found!');
	}

	return {
		profile: selected,
		member
	};
}) satisfies PageServerLoad;
