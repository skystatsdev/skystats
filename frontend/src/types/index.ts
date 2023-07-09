export type InventoryItem = {
	id: number;
	damage: number;
	count: number;
	head_texture_id?: string;
	skyblock_id?: string;
	reforge?: string;
	display: {
		name: string;
		lore: string[];
		has_glint: boolean;
		color?: number;
	};
	enchantments?: Record<string, number>;
	timestamp?: string;
};

export type SkyblockSkillData = {
	xp: number;
	level: number;
	max_level: number;
	xp_current: number;
	xp_for_next: number;
	progress: number;
	level_cap: number;
	uncapped_level: number;
	level_with_progress: number;
	uncapped_level_with_progress: number;
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

export interface SkyblockProfile {
	player: {
		uuid: string;
		username: string;
		skyblock: {
			profiles: {
				uuid: string;
				name: string;
				game_mode: string;
			}[];
			selected_profile: string;
		};
		rank: {
			name: string;
			color: string;
			plus_color?: string;
			formatted: string;
		};
	};
	profile: {
		uuid: string;
		game_mode: string;
		members: {
			uuid: string;
			username: string;
		}[];
	};
	profile_name: string;
	skyblock_level: number;
	fairy_souls: number;
	inventories: Record<SkyblockInventoryType, InventoryItem[]>;
	skills: Record<SkyblockSkillName, SkyblockSkillData>;
	stats: {
		deaths: {
			total: number;
			by_mob: Record<string, number>;
		};
		kills: {
			total: number;
			by_mob: Record<string, number>;
		};
		auction: Record<string, number>;
		dragon: Record<string, number>;
		rift: Record<string, number>;
		fishing: {
			total_items_fished: number;
			items_fished: Record<string, number>;
			sea_creature_kills: number;
			shredder: Record<string, number>;
		};
		mythos: {
			kills: number;
			burrows: Record<string, number>;
		};
		highest_damage: {
			normal: number;
			critical: number;
		};
		winter_records: Record<string, number>;
		misc: Record<string, number>;
	};
}
