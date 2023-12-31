export type SkyblockProfileLeveling = {
	experience: number;
	completions: Record<SkyBlockLevelCompletions, number>;
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

type SkyBlockLevelCompletions = 'NUCLEUS_RUNS' | 'REFINED_JYRRE';
