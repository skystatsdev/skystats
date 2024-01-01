import { getStats } from '$lib/stats';
import type { ProfileMemberDetails, StoredProfile, StoredProfileMember } from '$mongo/collections';
import {
	getStoredProfileMembers,
	profileMemberExists,
	updateStoredProfile,
	updateStoredProfileMember
} from '$mongo/profiles';
import type { SkyblockProfile } from '$types/hypixel';
import { getPlayer } from './hypixel';
import { getUsername } from './mojang';

export async function parseProfilesResponse(
	requesterUuid: string,
	profiles: SkyblockProfile[]
): Promise<StoredProfile[]> {
	requesterUuid = requesterUuid.replace(/-/g, '');
	const parsedProfiles: StoredProfile[] = [];

	for (const profile of profiles) {
		const parsed = await parseProfile(profile);

		for (const [memberId, member] of Object.entries(profile.members)) {
			const parsedMember = await parseProfileMember(profile, memberId, member);

			if (requesterUuid !== memberId.replace(/-/g, '')) {
				const exists = await profileMemberExists(memberId, profile.profile_id);

				// Only set the cute name for every member if the member doesn't exist already
				// This is because the cute name differs between members
				if (!exists) {
					parsedMember.cuteName = profile.cute_name;
				}
			} else {
				// Set the cute name and selected status for the requester
				parsedMember.cuteName = profile.cute_name;
				parsedMember.selected = profile.selected ?? false;
			}

			await updateStoredProfileMember(memberId, profile.profile_id, parsedMember);
		}

		await updateStoredProfile(parsed);
	}

	// Mark newly missing profile members as removed for the requester
	const existingProfiles = await getStoredProfileMembers(requesterUuid);

	// Update "removed" status for each profile member of the requester
	for (const existing of existingProfiles) {
		const present = profiles.some((profile) => profile.profile_id.replace(/-/g, '') === existing.id.profile);
		if (!existing.removed && present) continue;

		await updateStoredProfileMember(existing.id.player, existing.id.profile, {
			removed: !present
		});
	}

	return parsedProfiles;
}

export async function parseProfileMember(
	profile: SkyblockProfile,
	memberId: string,
	member: SkyblockProfile['members'][string]
): Promise<Partial<StoredProfileMember>> {
	const player = await getPlayer(memberId);

	return {
		id: {
			player: memberId.replace(/-/g, ''),
			profile: profile.profile_id.replace(/-/g, '')
		},
		api: {
			skills: member.player_data?.experience?.SKILL_MINING !== undefined,
			collections: member.collection !== undefined,
			inventory: member.inventory?.inv_contents !== undefined,
			vault: member.inventory?.personal_vault_contents !== undefined,
			// TODO: Update museum value somehow
			museum: true
		},
		removed: false,
		stats: getStats(profile, player?.data?.unparsed, memberId),
		lastUpdated: Math.floor(Date.now() / 1000)
	};
}

export async function parseProfile(profile: SkyblockProfile): Promise<StoredProfile> {
	const minions = [];
	const memberPromises: Promise<ProfileMemberDetails | null>[] = [];

	// Combine minion data from all members
	// Also get the username of each member and store it in the profile object
	// This makes displaying the member list easier and essentially caches the calls
	for (const [memberId, member] of Object.entries(profile.members)) {
		if (!member || member.profile?.coop_invitation?.confirmed === false) continue;

		memberPromises.push(
			new Promise((resolve) =>
				getUsername(memberId).then((ign) => {
					if (!ign) return resolve(null);

					resolve({
						ign,
						uuid: memberId.replace(/-/g, '')
					});
				})
			)
		);

		if (member?.player_data?.crafted_generators?.length) {
			minions.push(...member.player_data.crafted_generators);
		}
	}

	const resolvedMembers = await Promise.all(memberPromises);
	const members = resolvedMembers.filter((member): member is ProfileMemberDetails => member !== null);

	return {
		id: profile.profile_id,
		banking: {
			balance: profile.banking?.balance ?? 0
		},
		craftedMinions: Array.from(new Set(minions)),
		gameMode: profile.game_mode ?? 'normal',
		members,
		lastUpdated: Math.floor(Date.now() / 1000)
	};
}
