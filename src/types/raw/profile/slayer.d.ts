export type SkyBlockProfileSlayer = {
	slayer_quest: {
		type: string;
		tier: number;
		start_timestamp: number;
		completion_state: number;
		used_armor: boolean;
		solo: boolean;
		combat_xp: number;
		recent_mob_kills: { xp: number; timestamp: number }[];
		last_killed_mob_island: string;
	};
	slayer_bosses: Record<SkyblockSlayerBoss, SlayerData>;
};

export type SkyblockSlayerBoss = 'zombie' | 'spider' | 'wolf' | 'enderman' | 'blaze' | 'vampire';

type SlayerData = {
	claimed_levels: Record<string, boolean>;
	xp: number;
	boss_kills_tier_0: number;
	boss_kills_tier_1: number;
	boss_kills_tier_2: number;
	boss_kills_tier_3: number;
	boss_kills_tier_4: number;
};
