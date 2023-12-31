import * as stats from '$stats/index';
import type { SkyblockPlayerStats } from '$types';

export function getStats(profile: any, player: any, uuid: string): SkyblockPlayerStats {
	const userProfile = profile.members[uuid];

	const output = {
		// ? need to do otherwise ts screams at me for not having a type
		skills: stats.getSkills(userProfile, player, profile.members)
	};

	return output;
}
