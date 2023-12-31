export type SkyblockPlayerSkillStats = {
	skills: Record<SkyblockSkillName, SkyblockSkillData>;
	averageSkillLevel: number;
	averageSkillLevelWithoutProgress: number;
	totalSkillXp: number;
};

export type SkyblockSkillData = {
	xp: number;
	level: number;
	maxLevel: number;
	xpCurrent: number;
	maxExperience?: number;
	xpForNext: number;
	progress: number;
	levelCap: number;
	uncappedLevel: number;
	levelWithProgress: number;
	uncappedLevelWithProgress: number;
	rank?: number;
};

export type SkyblockSkillName =
	| 'farming'
	| 'mining'
	| 'combat'
	| 'foraging'
	| 'fishing'
	| 'enchanting'
	| 'alchemy'
	| 'carpentry'
	| 'runecrafting'
	| 'social'
	| 'taming';

export type SkyblockInventoryType =
	| 'armor'
	| 'player'
	| 'ender_chest'
	| 'accessory_bag'
	| 'potion_bag'
	| 'fishing_bag'
	| 'quiver'
	| 'trick_or_treat_bag'
	| 'wardrobe'
	| 'personal_vault';

export type PlayerHypixelRankData = {
	name: string;
	color: string;
	plus_color?: string;
	formatted: string;
};

export type LevelCaps = {
	farming: number;
	runecrafting: number;
};
