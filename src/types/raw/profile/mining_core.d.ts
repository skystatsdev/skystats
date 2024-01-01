export type MiningCore = {
	nodes?: Record<string, number>;
	recieved_free_tier?: boolean;
	tokens?: number;
	powder_mithril?: number;
	powder_mithril_total?: number;
	tokens_spent?: number;
	powder_spent_mithril?: number;
	experience?: number;
	last_reset?: number;
	daily_ores_mined_day_mithril_ore?: number;
	daily_ores_mined_mithril_ore?: number;
	retroactive_tier2_token?: boolean;
	crystals?: Record<CrystalNames, CrystalData>;
	greater_mines_last_access?: number;
	biomes?: MiningBiomes;
	powder_gemstone?: number;
	powder_gemstone_total?: number;
	daily_ores_mined_day_gemstone?: number;
	daily_ores_mined_gemstone?: number;
	powder_spent_gemstone?: number;
	daily_ores_mined_day?: number;
	daily_ores_mined?: number;
};

type CrystalNames =
	| 'jade_crystal'
	| 'amber_crystal'
	| 'topaz_crystal'
	| 'sapphire_crystal'
	| 'amethyst_crystal'
	| 'jasper_crystal'
	| 'ruby_crystal';

type CrystalData = {
	state: 'FOUND' | 'NOT_FOUND';
	total_placed: number;
	total_found: number;
};

type MiningBiomes = {
	precursor?: {
		parts_delivered?: string[];
	};
	goblin?: {
		king_quest_active?: boolean;
		king_quests_completed?: number;
	};
	jungle?: {
		jungle_temple_open?: boolean;
	};
};
