import { fetchMinecraftAccount } from '$api/mojang';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getPlayer, getProfiles } from '$api/hypixel';

export const load = (async ({ params }) => {
	const { player } = params;

	const account = await fetchMinecraftAccount(player);

	if (!account) {
		throw error(404, 'Player not found!');
	}

	const playerData = await getPlayer(account.id);

	if (!playerData) {
		throw error(404, 'Player data not found!');
	}

	const profiles = await getProfiles(account.id);

	if (!profiles) {
		throw error(404, 'Profiles not found!');
	}

	return {
		account,
		playerData,
		profiles
	};
}) satisfies LayoutServerLoad;
