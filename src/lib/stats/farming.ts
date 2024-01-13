import type {
	JacobsContestParticipation,
	SkyBlockProfileMember,
	JacobContest,
	JacobContestData,
	JacobCropStats
} from '$types/hypixel';
import {
	Crop,
	LIST_OF_CROPS,
	SkyBlockTime,
	fortuneFromPersonalBestContest,
	getCropFromContestKey
} from 'farming-weight';

export function getFarming(userProfile: Partial<SkyBlockProfileMember>): JacobContestData {
	const {
		double_drops: doubleDrops = 0,
		farming_level_cap: farmingLevelCap = 0,
		personal_bests: personalBests = false
	} = userProfile.jacobs_contest?.perks ?? {};

	const cropStats = getCropStats(userProfile.jacobs_contest);
	const contests = formatContests(userProfile.jacobs_contest?.contests ?? {}, cropStats);

	return {
		perks: {
			doubleDrops,
			farmingLevelCap,
			personalBests
		},
		participations: contests.length,
		contests: contests,
		crops: cropStats
	};
}

function formatContests(contests: Record<string, JacobsContestParticipation>, crops: Record<string, JacobCropStats>) {
	return Object.entries(contests)
		.filter(([, p]) => p.collected >= 100) // Less than 100 aren't counted in the game, so skip them
		.map<JacobContest>(([key, particpation]) => {
			const crop = getCropFromContestKey(key);

			if (crop && crops[crop]) {
				crops[crop].participations++;
			}

			return {
				crop: crop ?? 'unknown',
				timestamp: SkyBlockTime.fromContestKey(key).unixSeconds,
				collected: particpation.collected,
				position: particpation.claimed_position ?? -1,
				participants: particpation.claimed_participants ?? -1,
				medal: particpation.claimed_medal ?? undefined
			};
		});
}

function getCropStats(jacob: SkyBlockProfileMember['jacobs_contest'] | undefined) {
	const crops: Record<string, JacobCropStats> = {};

	// Initialize crops stats
	for (const crop of LIST_OF_CROPS) {
		const pb = jacob?.personal_bests?.[crop] ?? 0;
		crops[crop] = {
			personalBest: pb,
			pbFortune: fortuneFromPersonalBestContest(crop, pb),
			highestMedal: highestMedal(crop, jacob),
			participations: 0
		};
	}

	return crops;
}

const medalOrder = ['diamond', 'platinum', 'gold', 'silver', 'bronze'] as const;
function highestMedal(crop: Crop, jacob?: SkyBlockProfileMember['jacobs_contest']) {
	for (const medal of medalOrder) {
		if (jacob?.unique_brackets?.[medal]?.includes(crop)) return medal;
	}

	return 'none';
}
