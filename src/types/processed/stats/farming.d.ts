export interface JacobContestData {
	perks: JacobPerks;
	participations: number;
	contests: JacobContest[];
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
