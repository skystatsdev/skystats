import type { StoredProfileMemberData } from '$mongo/collections';
import * as stats from '$stats/index';
import type { HypixelPlayerData, SkyblockProfile } from '$types/hypixel';

export function getStats(profile: SkyblockProfile, player: HypixelPlayerData, uuid: string): StoredProfileMemberData {
	const userProfile = profile.members[uuid];

	const output = {
		// ? need to do otherwise ts screams at me for not having a type
		skills: stats.getSkills(userProfile, player, profile.members),
		unparsed: userProfile
	};

	return output;
}
