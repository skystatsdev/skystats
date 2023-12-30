import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { account, profiles } = await parent();

	const selected = profiles.profile;

	if (!selected) {
		throw redirect(301, `/@${account.name}/${profiles.profiles[0].profile_id}`);
	}

	throw redirect(301, `/@${account.name}/${selected.cute_name}`);
}) satisfies PageServerLoad;
