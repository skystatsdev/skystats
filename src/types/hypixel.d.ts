export type HypixelRequestOptions = {
	endpoint?: string;
	query?: Record<string, any>;
	usesApiKey?: boolean;
};

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

export type SkyblockPlayerCurrencies = {
	bank: number;
	purse: number;
	motes: number;
	essence: Record<Lowercase<SkyblockEssence>, number>;
}

export type SkyblockProfile = {
	profile_id: string;
	cute_name: string;
	game_mode?: string;
	community_upgrades: {
		currently_upgrading?: string;
		upgrade_states: {
			upgrade: string;
			tier: number;
			started_ms: number;
			started_by: string;
			claimed_ms: number;
			claimed_by: string;
			fasttracked: boolean;
		}[];
	};
	members: Record<string, Partial<SkyblockProfileMember>>;
	banking: {
		balance: number;
		transactions: {
			amount: number;
			timestamp: number;
			action: string;
			initiator_name: string;
		}[];
	};
	selected?: boolean;
};

export type SkyblockProfileMember = {
	rift: Record<any, any>;
	player_data: SkyblockProfilePlayerData;
	accessory_bag_storage: SkyblockProfileAccessoryBagStorage;
	leveling: SkyblockProfileLeveling;
	item_data: {
		soulflow: number;
		teleporter_pill_consumed: boolean;
	};
	jacobs_contest: SkyblockProfileJacobsContest;
	currencies: SkyblockProfileCurrencies;
	dungeons: SkyblockProfileDungeons;
	profile: {
		first_join: number;
		personal_bank_upgrade: number;
		coop_invitation?: {
			confirmed: boolean;
		};
	};
	pets_data: SkyblockProfilePetsData;
	player_id: string;
	nether_island_player_data: SkyblockProfileNetherIslandPlayerData;
	experimentation: {
		simon: Record<string, number>;
		pairings: Record<string, number>;
		numbers: Record<string, number>;
		claims_resets: number;
		claims_resets_timestamp: number;
		seurums_drank: number;
	};
	mining_core: SkyblockProfileMiningCore;
	bestiary: {
		migrated_stats: boolean;
		migration: boolean;
		kills: Record<string, number>;
		deaths: Record<string, number>;
		milestone: Record<string, number>;
		miscellaneous: Record<string, number>;
	};
	quests: {
		harp_quest: Record<string, any>;
		trapper_quest: Record<string, any>;
	};
	player_stats: {
		candy_collected: {
			total: number;
			purple_candy: number;
			green_candy: number;
		} & Record<string, { total: number; purple_candy: number; green_candy: number }>;
		kills: Record<string, number>;
		deaths: Record<string, number>;
		highest_critical_damage: number;
		items_fished: Record<'total' | 'normal' | 'treasure' | 'large_treasure' | 'trophy_fish', number>;
		races: {
			foraging_race_best_time: number;
			end_race_best_time: number;
			chicken_race_best_time_2: number;
			dungeon_hub: Record<string, number>;
			rift_race_best_time: number;
		};
		auctions: {
			bids: number;
			highest_bid: number;
			won: number;
			total_bought: Record<SkyblockItemRarity | 'total', number>;
			gold_spent: number;
			created: number;
			fees: number;
			completed: number;
			total_sold: Record<SkyblockItemRarity | 'total', number>;
			gold_earned: number;
			no_bids: number;
		};
		end_island: {
			dragon_fight: {
				ender_crystals_destroyed: number;
				most_damage: Record<SkyblockDragon | 'best', number>;
				fasted_kill: Record<SkyblockDragon | 'best', number>;
				highest_rank: Record<SkyblockDragon | 'best', number>;
				amount_summoned: Record<SkyblockDragon | 'total', number>;
				summoning_eyes_contributed: Record<SkyblockDragon | 'total', number>;
			};
			summoning_eyes_collected: number;
			special_zealot_loot_collected: number;
		};
		gifts: {
			total_given: number;
			total_received: number;
		};
		winter: Record<string, number>;
		shredder_rod: Record<string, number>;
		pets: {
			milestone: Record<string, number>;
			total_exp_gained: number;
		};
		mythos: {
			kills: number;
			burrows_dug_next: Record<SkyblockBurrowType | 'total', number>;
			burrows_dug_combat: Record<SkyblockBurrowType | 'total', number>;
			burrows_dug_treasure: Record<SkyblockBurrowType | 'total', number>;
			burrows_chains_complete: Record<SkyblockBurrowType | 'total', number>;
		};
		highest_damage: number;
		sea_creature_kills: number;
		rift: Record<string, number | Record<string, number>>;
		spooky: {
			bats_spawned: Record<string, number>;
		};
	};
	forge: {
		forge_processes: Record<
			string,
			Record<
				string,
				{
					type: string;
					id: string;
					startTime: number;
					slot: number;
					notified: boolean;
				}
			>
		>;
	};
	fairy_soul: {
		fairy_exchanges: number;
		total_collected: number;
		unspent_souls: number;
	};
	objectives: {
		tutorial: string[];
	};
	slayer: {
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
		slayer_bosses: {
			[slayer in SkyblockSlayerBoss]: {
				claimed_levels: Record<string, boolean>;
				xp: number;
			} & Record<string, number>;
		};
	};
	trophy_fish: {
		rewards: number[];
	} & Record<string, number>;
	inventory: {
		inv_contents: SkyblockNBTData;
		ender_chest_contents: SkyblockNBTData;
		backpack_icons: Record<string, SkyblockNBTData>;
		bag_contents: Record<SkyblockBagContentsType, SkyblockNBTData>;
		inv_armor: SkyblockNBTData;
		equipment_contents: SkyblockNBTData;
		personal_vault_contents: SkyblockNBTData;
		wardrobe_equipped_slot: number;
		backpack_contents: Record<string, SkyblockNBTData>;
		sacks_counts: Record<string, number>;
		wardrobe_contents: SkyblockNBTData;
	};
	collection: Record<string, number>;
};

export type SkyblockNBTData = {
	type: number;
	data: string;
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
export type SkyblockSlayerBoss = 'zombie' | 'spider' | 'wolf' | 'enderman' | 'blaze' | 'vampire';
export type SkyblockDungeonClass = 'mage' | 'berserk' | 'archer' | 'healer' | 'tank';
export type SkyblockItemRarity =
	| 'COMMON'
	| 'UNCOMMON'
	| 'RARE'
	| 'EPIC'
	| 'LEGENDARY'
	| 'MYTHIC'
	| 'SPECIAL'
	| 'VERY_SPECIAL';
export type SkyblockDragon = 'protector' | 'wise' | 'young' | 'old' | 'unstable' | 'strong' | 'superior';
export type SkyblockEssence = 'WITHER' | 'DRAGON' | 'SPIDER' | 'UNDEAD' | 'DIAMOND' | 'GOLD' | 'ICE' | 'CRIMSON';
export type SkyblockBagContentsType = 'potion_bag' | 'talisman_bag' | 'fishing_bag' | 'quiver';
export type SkyblockBurrowType = 'COMMON' | 'none' | 'RARE' | 'LEGENDARY';
export type SkyblockJacobsContestMedal = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type SkyblockJacobContestCrop =
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
export type SkyblockMiningCrystal =
	| 'jade_crystal'
	| 'amber_crystal'
	| 'topaz_crystal'
	| 'sapphire_crystal'
	| 'amethyst_crystal'
	| 'jasper_crystal'
	| 'ruby_crystal';

export type SkyblockProfilePlayerData = {
	visited_zones: string[];
	last_death: number;
	perks: Record<string, number>;
	active_effects: {
		effect: string;
		level: number;
		modifiers: {
			key: string;
			amp: number;
		}[];
		ticks_remaining: number;
		infinite: boolean;
	}[];
	paused_effects: Record<any, any>[];
	reaper_peppers_eaten: number;
	temp_stat_buffs: Record<any, any>[];
	death_count: number;
	disabled_potion_effects: string[];
	achievement_spawned_island_types: string[];
	visited_modes: string[];
	unlocked_coll_tiers: string[];
	crafted_generators: string[];
	fishing_treasure_caught: number;
	experience: Record<SkyblockSkillType, number>;
};

export type SkyblockProfileAccessoryBagStorage = {
	tuning: Record<any, any>;
	unlocked_powers: string[];
	selected_power: string;
	bag_upgrades_purchased: number;
	highest_magical_power: number;
};

export type SkyblockProfileLeveling = {
	experience: number;
	completions: Record<string, any>;
	completed_tasks: string[];
	category_expanded: boolean;
	last_viewed_tasks: string[];
	highest_pet_score: number;
	mining_fiesta_ores_mined: number;
	fishing_festival_sharks_killed: number;
	migrated: boolean;
	migrated_completions_2: boolean;
	claimed_talisman: boolean;
	bop_bonus: string;
	selected_symbol: string;
	emblem_unlocks: string[];
	task_sort: string;
};

export type SkyblockProfileJacobsContest = {
	medals_inv: Partial<Record<Exclude<SkyblockJacobsContestMedal, 'platinum' | 'diamond'>, number>>;
	perks: {
		double_drops?: number;
		farming_level_cap?: number;
		personal_bests?: true;
	};
	contests: Record<string, SkyblockJacobsContest>;
	talked?: true;
	unique_brackets: Partial<Record<SkyblockJacobsContestMedal, SkyblockJacobContestCrop[]>>;
	migration?: true;
	personal_bests?: Partial<Record<SkyblockJacobContestCrop, number>>;
};

export type SkyblockJacobsContest = {
	collected: number;
	claimed_medal?: SkyblockJacobsContestMedal;
	claimed_rewards?: boolean;
	claimed_position?: number;
	claimed_participants?: number;
};

export type SkyblockProfileCurrencies = {
	coin_purse: number;
	motes_purse: number;
	essence: {
		[essence in SkyblockEssence]: {
			current: number;
		};
	};
};

export type SkyblockProfileDungeons = {
	dungeon_types: {
		catacombs: SkyblockDungeonType & { experience: number };
		master_catacombs: SkyblockDungeonType;
	};
	player_classes: Record<
		SkyblockDungeonClass,
		{
			experience: number;
		}
	>;
	dungeon_journal: {
		unlocked_journals: string[];
		dungeons_blah_blah: string[];
		selected_dungeon_class: string;
		daily_runs: Record<string, number>;
		treasures: Record<string, any[]>;
		dungeon_hub_race_settings: Record<string, string | boolean>;
	};
};

export type SkyblockDungeonType = {
	times_played: Record<string, number>;
	tier_completions: Record<string, number>;
	fastest_time: Record<string, number>;
	best_runs: Record<
		string,
		{
			timestamp: number;
			score_exploration: number;
			score_speed: number;
			score_skill: number;
			score_bonus: number;
			dungeon_class: string;
			teammates: string[];
			elapsed_time: number;
			damage_dealt: number;
			deaths: number;
			mobs_killed: number;
			secrets_found: number;
			damage_mitigated: number;
			ally_healing: number;
		}[]
	>;
	best_score: Record<string, number>;
	mobs_killed: Record<string, number>;
	most_mobs_killed: Record<string, number>;
	most_damage_berserk: Record<string, number>;
	most_healing: Record<string, number>;
	watcher_kills: Record<string, number>;
	highest_tier_completed: number;
	fastest_time_s: Record<string, number>;
	most_damage_mage: Record<string, number>;
	fastest_time_s_plus: Record<string, number>;
	most_damage_healer: Record<string, number>;
	most_damage_archer: Record<string, number>;
	milestone_completions: Record<string, number>;
	most_damage_tank: Record<string, number>;
};

export type SkyblockProfilePetsData = {
	autopet: {
		rules_limit: number;
		rules: {
			uuid: string;
			id: string;
			name: string;
			uniqueId: string;
			exceptions: Record<any, any>[];
			disabled: boolean;
			data: Record<string, any>;
		}[];
		migrated: boolean;
		migrated_2: boolean;
	};
	pets: {
		uuid: string;
		uniqueId: string;
		type: string;
		exp: number;
		active: boolean;
		tier: number;
		heldItem?: string;
		candyUsed: number;
		skin?: string;
	}[];
};

export type SkyblockProfileNetherIslandPlayerData = {
	kuudra_completed_tiers: Record<string, number>;
	dojo: Record<string, number>;
	abiphone: Record<any, any>;
	matriarch: Record<any, any>;
	selected_faction: string;
	mages_reputation: number;
	barbarians_reputation: number;
	last_minibosses_killed: string[];
	kuudra_party_finder: Record<any, any>;
};

export type SkyblockProfileMiningCore = {
	nodes: Record<string, number>;
	recieved_free_tier: boolean;
	tokens: number;
	powder_mithril: number;
	powder_mithril_total: number;
	tokens_spent: number;
	powder_spent_mithril: number;
	experience: number;
	last_reset: number;
	daily_ores_mined_day_mithril_ore: number;
	daily_ores_mined_mithril_ore: number;
	retroactive_tier2_token: boolean;
	crystals: Record<string, { state: 'FOUND' | 'NOT_FOUND'; total_placed?: number; total_found?: number }>;
	greater_mines_last_access: number;
	biomes: Record<any, any>;
	powder_gemstone: number;
	powder_gemstone_total: number;
	daily_ores_mined_day_gemstone: number;
	daily_ores_mined_gemstone: number;
	powder_spent_gemstone: number;
	daily_ores_mined_day: number;
	daily_ores_mined: number;
};

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

export type PlayerSkyblockProfileData = {
	uuid: string;
	name: string;
	game_mode: string;
};

export type ProfileMemberData = {
	uuid: string;
	username: string;
};

export type PlayerHypixelRankData = {
	name: string;
	color: string;
	plus_color?: string;
	formatted: string;
};

export type GetProfiles = {
	profile: SkyblockProfile;
	profiles: SkyblockProfile[];
	uuid: string;
};

export interface HypixelPlayerResponse {
	success: true;
	player: HypixelPlayerData;
}

export interface HypixelPlayerData {
	uuid: string;
	firstLogin: number;
	lastLogin: number;
	playername: string;
	displayname: string;
	karma: number;

	prefix?: string;
	rank?: string;
	monthlyPackageRank?: string;
	monthlyRankColor?: string;
	newPackageRank?: string;
	rankPlusColor?: string;

	socialMedia?: {
		links?: {
			DISCORD?: string;
			HYPIXEL?: string;
			[key: string]: string;
		};
	};
	achievements: {
		[string: string]: number;
	};
}

export type LevelCaps = {
	farming: number;
	runecrafting: number;
};
