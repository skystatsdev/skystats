import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { profile } = params;
	const { profiles } = await parent();

	const selected = profiles.profiles.find(
		(p: { cute_name: string; profile_id: string }) => p.cute_name === profile || p.profile_id === profile
	);

	return {
		profile: selected
	};
}) satisfies PageServerLoad;
