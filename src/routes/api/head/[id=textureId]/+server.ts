import { getHead } from '$lib/renderer';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/head/[id=textureId]
export const GET: RequestHandler = async ({ params }) => {
	const { id } = params;

	try {
		const attachment = await getHead(id);

		return new Response(attachment);
	} catch (errorMsg) {
		console.log(errorMsg);
		throw error(500, 'Internal server error');
	}
};
