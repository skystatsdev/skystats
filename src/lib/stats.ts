import * as stats from '$stats/index';

export function getStats(profile: any, player: any, uuid: string) {
	const userProfile = profile.members[uuid];

	const output = {
		// ? need to do otherwise ts screams at me for not having a type
		skills: {}
	};

	output.skills = stats.getSkills(userProfile, player, profile.members);

	return output;
}
