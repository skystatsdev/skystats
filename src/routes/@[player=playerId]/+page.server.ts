import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { account, profiles } = await parent();

	const selected = profiles.find((p) => p.selected);

	if (!selected) {
		throw redirect(301, `/@${account.name}/${profiles[0].cuteName}`);
	}

	throw redirect(301, `/@${account.name}/${selected.cuteName}`);
}) satisfies PageServerLoad;
