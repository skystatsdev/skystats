import type { Crop } from "farming-weight";

export type JacobsContest = {
	medals_inv?: Partial<Record<Exclude<JacobsContestMedal, 'platinum' | 'diamond'>, number>>;
	perks?: {
		double_drops?: number;
		farming_level_cap?: number;
		personal_bests?: true;
	};
	contests?: Record<string, JacobsContestParticipation>;
	talked?: true;
	unique_brackets?: Record<JacobsContestMedal, (JacobContestCrop | Crop)[] | undefined>;
	migration?: true;
	personal_bests?: Record<JacobContestCrop | Crop, number | undefined>;
};

type JacobsContestParticipation = {
	collected: number;
	claimed_medal?: JacobsContestMedal;
	claimed_rewards?: boolean;
	claimed_position?: number;
	claimed_participants?: number;
};

type JacobContestCrop =
	| 'SUGAR_CANE'
	| 'CACTUS'
	| 'PUMPKIN'
	| 'NETHER_STALK'
	| 'INK_SACK:3'
	| 'MELON'
	| 'WHEAT'
	| 'MUSHROOM_COLLECTION'
	| 'POTATO_ITEM'
	| 'CARROT_ITEM';

type JacobsContestMedal = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
