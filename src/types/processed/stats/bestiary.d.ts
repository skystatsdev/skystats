export type SkyBlockStatsBestiary = {
	bestiary: Record<string, Bestiary>;
	milestone: 0;
	maxMilestone: 0;
	tiers: 0;
	totalTiers: 0;
};

export type Bestiary = {
	name: string;
	texture: string;
	mobs: BestiaryMob[];
	mobsUnlocked: number;
	mobsMaxed: number;
};

export type BestiaryMob = {
	name: string;
	texture: string;
	kills: number;
	nextTierKills: number | null;
	maxKills: number;
	tier: number;
	maxTier: number;
};
