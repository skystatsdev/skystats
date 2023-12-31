export type SkyblockProfileDungeons = {
	dungeon_types?: {
		catacombs?: DungeonType & { experience: number };
		master_catacombs?: DungeonType;
	};
	player_classes?: Record<DungeonClass, ClassData>;
	dungeon_journal?: {
		unlocked_journals?: string[];
		dungeons_blah_blah?: string[];
		selected_dungeon_class?: string;
		daily_runs?: Record<string, number>;
		treasures?: Record<string, any[]>;
		dungeon_hub_race_settings?: Record<string, string | boolean>;
	};
};

type DungeonType = {
	times_played?: Record<string, number>;
	tier_completions?: Record<string, number>;
	fastest_time?: Record<string, number>;
	best_runs?: Record<
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
	best_score?: Record<string, number>;
	mobs_killed?: Record<string, number>;
	most_mobs_killed?: Record<string, number>;
	most_damage_berserk?: Record<string, number>;
	most_healing?: Record<string, number>;
	watcher_kills?: Record<string, number>;
	highest_tier_completed?: number;
	fastest_time_s?: Record<string, number>;
	most_damage_mage?: Record<string, number>;
	fastest_time_s_plus?: Record<string, number>;
	most_damage_healer?: Record<string, number>;
	most_damage_archer?: Record<string, number>;
	milestone_completions?: Record<string, number>;
	most_damage_tank?: Record<string, number>;
};

type DungeonClass = 'mage' | 'berserk' | 'archer' | 'healer' | 'tank';

type ClassData = {
	experience: number;
};
