import type { StoredProfileMemberData } from '$mongo/collections';
import * as stats from '$stats/index';
import type { HypixelPlayerData, SkyblockProfile } from '$types/hypixel';

export async function getStats(
	profile: SkyblockProfile,
	player: HypixelPlayerData,
	uuid: string
): Promise<StoredProfileMemberData> {
	const userProfile = profile.members[uuid];

	const items = await stats.getItems(userProfile);

	const output = {
		skills: stats.getSkills(userProfile, player, profile.members),
		slayers: stats.getSlayers(userProfile),
		items: items
		// unparsed: userProfile
	};

	return output;
}
