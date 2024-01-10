import type { CrystalNames, CrystalData } from '$types/hypixel';

export type ForgeItem = {
	id: string;
	slot: number;
	timeFinished: number;
	name?: string;
};

export type SkyBlockMiningData = {
	commissions: {
		milestone: number;
		completions: number;
	};
	forge?: {
		processes: ForgeItem[];
	};
	core?: {
		level: {
			xp: number;
			level: number;
			maxLevel: number;
			xpCurrent: number;
			maxExperience: number;
			xpForNext: number;
			progress: number;
			levelCap: number;
			uncappedLevel: number;
			levelWithProgress: number;
			unlockableLevelWithProgress: number;
		};
		tokens: {
			total: number;
			spent: number;
			available: number;
		};
		selected_pickaxe_ability: string | null;
		powder: Record<
			string,
			{
				total: number;
				spent: number;
				available: number;
			}
		>;
		crystal_nucleus: {
			times_completed: number;
			crystals?: Record<CrystalNames, CrystalData>;
			precursor?: {
				parts_delivered?: string[];
			};
		};
		daily_ores: {
			mined?: number;
			day?: number;
			ores: Record<
				string,
				{
					day: number;
					count: number;
				}
			>;
		};
		hotm_last_reset?: number;
		crystal_hollows_last_access?: number;
		daily_effect?: {
			effect?: string;
			last_changed?: number;
		};
		nodes?: Record<string, number>;
	};
};
