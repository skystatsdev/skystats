import type { StoredProfileMemberData } from '$mongo/collections';
import * as stats from '$stats/index';
import type { HypixelPlayerData, SkyblockProfile } from '$types/hypixel.d.ts';

export function getStats(profile: SkyblockProfile, player: HypixelPlayerData, uuid: string): StoredProfileMemberData {
	const userProfile = profile.members[uuid];

	const output = {
		skills: stats.getSkills(userProfile, player, profile.members),
		unparsed: userProfile
	};

	return output;
}
