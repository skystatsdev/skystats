import { getPlayer, getProfileMember } from '$api/hypixel';
import { getStats } from '$lib/stats';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { profile } = params;
	const { profiles, account } = await parent();

	const selected =
		profiles.find((p) => p.cuteName?.toUpperCase() === profile.toUpperCase() || p.id === profile) ?? profiles[0];

	const member = await getProfileMember(account.id, selected.id);

	return {
		profile: selected,
		member
	};
}) satisfies PageServerLoad;
