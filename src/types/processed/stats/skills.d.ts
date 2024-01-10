export type SkyBlockStatsSkills = {
	skills: Record<SkyblockSkillName, SkyBlockStatsSkillData>;
	averageSkillLevel: number;
	averageSkillLevelWithoutProgress: number;
	totalSkillXp: number;
};

export type SkyBlockStatsSkillData = {
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

export type SkyBlockStatsSkillName =
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

export type SkyBlockStatsLevelCaps = {
	farming: number;
	runecrafting: number;
};
