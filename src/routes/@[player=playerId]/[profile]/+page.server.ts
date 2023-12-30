import { getPlayer } from '$api/hypixel';
import { getStats } from '$lib/stats';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, params }) => {
	const { profile } = params;
	const { profiles, account } = await parent();

	const selected = profiles.profiles.find(
		(p: { cute_name: string; profile_id: string }) => p.cute_name === profile || p.profile_id === profile
	);

	const player = await getPlayer(account.id);

	const stats = await getStats(selected, player, account.id);

	return {
		player,
		profile: selected,
		stats
	};
}) satisfies PageServerLoad;
