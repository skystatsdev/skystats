export type SkyblockProfilePlayerData = {
	visited_zones: string[];
	last_death?: number;
	perks?: Record<string, number>;
	active_effects?: PlayerDataActivePotionEffect[];
	paused_effects?: Record<string, PlayerDataTempStatBuffs>[];
	reaper_peppers_eaten?: number;
	// TODO: Figure out what this is
	// temp_stat_buffs: Record<string, any>[];
	death_count?: number;
	disabled_potion_effects?: string[];
	achievement_spawned_island_types?: string[];
	visited_modes?: string[];
	unlocked_coll_tiers?: string[];
	crafted_generators?: string[];
	fishing_treasure_caught?: number;
	experience?: Record<SkyblockSkillType, number>;
};

export type PlayerDataActivePotionEffect = {
	effect: string;
	level: number;
	modifiers: {
		key: string;
		amp: number;
	}[];
	ticks_remaining: number;
	infinite: boolean;
};

export type PlayerDataTempStatBuffs = {
	stat: number;
	key: string;
	amount: number;
	expire_at: number;
};

export type SkyblockSkillType =
	| 'SKILL_FISHING'
	| 'SKILL_ALCHEMY'
	| 'SKILL_DUNGEONEERING'
	| 'SKILL_RUNECRAFTING'
	| 'SKILL_MINING'
	| 'SKILL_FARMING'
	| 'SKILL_ENCHANTING'
	| 'SKILL_TAMING'
	| 'SKILL_FORAGING'
	| 'SKILL_SOCIAL'
	| 'SKILL_CARPENTRY'
	| 'SKILL_COMBAT';
