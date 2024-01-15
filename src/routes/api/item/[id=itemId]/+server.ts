import { renderItem } from '$lib/renderer';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/head/[id=itemId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	try {
		const attachment = await renderItem(id, {});

		return new Response(attachment.image);
	} catch (errorMsg) {
		throw error(500, 'Internal server error');
	}
};
