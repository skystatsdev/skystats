import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	// TODO: Implement page with list of profiles

	throw error(404, 'Not implemented yet');
}) satisfies PageServerLoad;
