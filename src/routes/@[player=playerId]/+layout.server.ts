import { fetchMinecraftAccount } from '$api/mojang';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getPlayer, getProfiles } from '$api/hypixel';

export const load = (async ({ params }) => {
	const { player: playerId } = params;

	const account = await fetchMinecraftAccount(playerId);

	if (!account) {
		throw error(404, 'Player not found!');
	}

	const player = await getPlayer(account.id);

	if (!player) {
		throw error(404, 'Player data not found!');
	}

	const profiles = await getProfiles(account.id);

	if (!profiles?.length) {
		throw error(404, 'Profiles not found!');
	}

	return {
		account,
		player,
		profiles
	};
}) satisfies LayoutServerLoad;
