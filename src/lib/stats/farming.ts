import type {
	JacobsContestParticipation,
	SkyBlockProfileMember,
	JacobContest,
	JacobContestData,
	JacobCropStats
} from '$types/hypixel';
import {
	type Crop,
	LIST_OF_CROPS,
	SkyBlockTime,
	calculateJacobContestMedal,
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

	const stats = {
		perks: {
			doubleDrops,
			farmingLevelCap,
			personalBests
		},
		medals: {
			gold: 0,
			silver: 0,
			bronze: 0,
			...(userProfile.jacobs_contest?.medals_inv ?? {})
		},
		earnedMedals: {
			diamond: 0,
			platinum: 0,
			gold: 0,
			silver: 0,
			bronze: 0
		},
		participations: 0,
		contests: [] as JacobContest[],
		crops: cropStats
	};

	stats.contests = parseContests(userProfile.jacobs_contest?.contests ?? {}, stats);
	stats.participations = stats.contests.length;

	return stats;
}

function parseContests(contests: Record<string, JacobsContestParticipation>, stats: JacobContestData) {
	return Object.entries(contests)
		.filter(([, p]) => p.collected >= 100) // Less than 100 aren't counted in the game, so skip them
		.map<JacobContest>(([key, particpation]) => {
			const crop = getCropFromContestKey(key);

			if (crop && stats.crops[crop]) {
				stats.crops[crop].participations++;
			}

			const medal = calculateJacobContestMedal(particpation);

			if (medal) {
				stats.earnedMedals[medal]++;
			}

			return {
				crop: crop ?? 'unknown',
				timestamp: SkyBlockTime.fromContestKey(key).unixSeconds,
				collected: particpation.collected,
				position: particpation.claimed_position ?? -1,
				participants: particpation.claimed_participants ?? -1,
				medal: medal
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
