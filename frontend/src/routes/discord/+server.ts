/* eslint-disable */
import { redirect } from '@sveltejs/kit';
import { PUBLIC_DISCORD_INVITE } from '$env/static/public';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({}) => {
	throw redirect(308, PUBLIC_DISCORD_INVITE);
};
