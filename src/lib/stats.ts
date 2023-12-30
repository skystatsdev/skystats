import { getSkills } from './stats/index.js';

export * as stats from './stats/index.js';

export function getStats(profile: any, player: any, uuid: string) {
	const userProfile = profile.members[uuid];

	const output = {
		// ? need to do otherwise ts screams at me for not having a type
		skills: {}
	};

	output.skills = getSkills(userProfile, player, profile.members);

	return output;
}
