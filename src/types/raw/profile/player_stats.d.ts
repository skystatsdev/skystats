export type SkyBlockProfilePlayerStats = {
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
		total_bought: Record<ItemRarity | 'total', number>;
		gold_spent: number;
		created: number;
		fees: number;
		completed: number;
		total_sold: Record<ItemRarity | 'total', number>;
		gold_earned: number;
		no_bids: number;
	};
	end_island: {
		dragon_fight: {
			ender_crystals_destroyed: number;
			most_damage: Record<Dragon | 'best', number>;
			fasted_kill: Record<Dragon | 'best', number>;
			highest_rank: Record<Dragon | 'best', number>;
			amount_summoned: Record<Dragon | 'total', number>;
			summoning_eyes_contributed: Record<Dragon | 'total', number>;
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
		burrows_dug_next: Record<BurrowType | 'total', number>;
		burrows_dug_combat: Record<BurrowType | 'total', number>;
		burrows_dug_treasure: Record<BurrowType | 'total', number>;
		burrows_chains_complete: Record<BurrowType | 'total', number>;
	};
	highest_damage: number;
	sea_creature_kills: number;
	rift: Record<string, number | Record<string, number>>;
	spooky: {
		bats_spawned: Record<string, number>;
	};
};

type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'SPECIAL' | 'VERY_SPECIAL';

type Dragon = 'protector' | 'wise' | 'young' | 'old' | 'unstable' | 'strong' | 'superior';

type BurrowType = 'COMMON' | 'none' | 'RARE' | 'LEGENDARY';
