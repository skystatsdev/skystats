import type { StoredProfileMemberData } from '$mongo/collections';
import * as stats from '$stats/index';
import type { HypixelPlayerData, SkyBlockProfile } from '$types/hypixel';

export function getStats(profile: SkyBlockProfile, player: HypixelPlayerData, uuid: string): StoredProfileMemberData {
	const userProfile = profile.members[uuid];

	const output = {
		skills: stats.getSkills(userProfile, player, profile.members),
		currencies: stats.getCurrencies(userProfile, profile),
		slayers: stats.getSlayers(userProfile),
		mining: stats.getMining(userProfile, player)
		// unparsed: userProfile
	};

	return output;
}
