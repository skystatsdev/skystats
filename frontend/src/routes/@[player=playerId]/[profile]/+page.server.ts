import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Profiles } from '$lib/skyblock';

export const load = (async ({ params, fetch }) => {
	const { player, profile } = params;

	let ign = player;
	let uuid = player;
	let profileName = profile;

	//! Very temporary calls to other API as the main one is being built

	const accountRequest = await fetch(`https://elitebot.dev/api/account/${player}`);

	if (accountRequest.status !== 200) {
		throw error(accountRequest.status, 'Player not found');
	}

	const { account } = await accountRequest.json();
	ign = account.name;
	uuid = account.id;

	const profilesReq = await fetch(`https://elitebot.dev/api/profiles/${uuid}`);

	if (profilesReq.status !== 200) {
		throw error(profilesReq.status, 'Profiles not found');
	}

	const { profiles } = (await profilesReq.json()) as Profiles;

	const selectedProfile = profiles.find(
		(profile) => profile.cute_name === profileName || profile.profile_id === profileName
	);

	if (!selectedProfile) {
		throw error(404, 'Profile not found');
	}

	profileName = selectedProfile.cute_name;

	return {
		account: account,
		ign: ign,
		profileName: profileName,
		profile: selectedProfile
	};
}) satisfies PageServerLoad;
