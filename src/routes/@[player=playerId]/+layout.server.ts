import { FetchMinecraftAccount } from '$api/mojang';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { FetchPlayerData, FetchProfiles } from '$api/hypixel';

export const load = (async ({ params }) => {
	const { player } = params;

	const account = await FetchMinecraftAccount(player);

	if (!account) {
		throw error(404, 'Player not found!');
	}

	const playerData = await FetchPlayerData(account.id);

	if (!playerData) {
		throw error(404, 'Player data not found!');
	}

	const profiles = await FetchProfiles(account.id);

	if (!profiles || profiles.success === false || profiles.profiles.length === 0) {
		throw error(404, 'Profiles not found!');
	}

	return {
		account,
		playerData,
		profiles
	};
}) satisfies LayoutServerLoad;
