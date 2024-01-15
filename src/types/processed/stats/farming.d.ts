import type { JacobsContestMedal } from '$types/raw/profile/jacob_contests';

export interface JacobContestData {
	perks: JacobPerks;
	participations: number;
	contests: JacobContest[];
	medals: Record<Exclude<JacobsContestMedal, 'platinum' | 'diamond'>, number>;
	earnedMedals: Record<JacobsContestMedal, number>;
	crops: Record<string, JacobCropStats>;
}

export interface JacobPerks {
	doubleDrops: number;
	farmingLevelCap: number;
	personalBests: boolean;
}

export interface JacobContest {
	crop: Crop | 'unknown';
	collected: number;
	position: number;
	participants: number;
	medal?: JacobsContestMedal;
	timestamp: number;
}

export interface JacobCropStats {
	personalBest: number;
	pbFortune: number;
	participations: number;
	highestMedal: JacobsContestMedal | 'none';
}
