import { getLevelByXp } from '$lib/stats/skills/leveling';
import type {
	SkyBlockProfileMember,
	HypixelPlayerData,
	MiningCore,
	ForgeItem,
	SkyBlockMiningData
} from '$types/hypixel';
import type { Range } from '$types/util';
import { HOTM, FORGE_TIMES, QUICK_FORGE_MULTIPLIER } from '$constants';
import { calcHotmTokens } from '$lib/stats/mining/hotm';

import moment from 'moment';

export function getMiningCore(userProfile: Partial<SkyBlockProfileMember>): SkyBlockMiningData['core'] {
	const data = userProfile.mining_core;
	if (!data) return undefined;

	const level = getLevelByXp(data.experience ?? 0, { type: 'hotm' });
	const totalTokens = calcHotmTokens(level.level, data.nodes?.special_0 ?? 0);

	const completedCrystals = data.crystals
		? Object.values(data.crystals)
				.filter((x) => x.total_placed)
				.map((x) => x.total_placed)
		: [];

	return {
		level,
		tokens: {
			total: totalTokens,
			spent: data.tokens_spent ?? 0,
			available: totalTokens - (data.tokens_spent ?? 0)
		},
		selected_pickaxe_ability: HOTM.names[data.selected_pickaxe_ability as keyof typeof HOTM.names] ?? null,
		powder: Object.fromEntries(
			['mithril', 'gemstone'].map((type) => {
				return [
					type,
					{
						total:
							((data[`powder_${type}` as keyof MiningCore] as number) ?? 0) +
							((data[`powder_spent_${type}` as keyof MiningCore] as number) ?? 0),
						spent: (data[`powder_spent_${type}` as keyof MiningCore] as number) ?? 0,
						available: (data[`powder_${type}` as keyof MiningCore] as number) ?? 0
					}
				];
			})
		),
		crystal_nucleus: {
			times_completed: completedCrystals.length ? Math.min(...completedCrystals) : 0,
			crystals: data.crystals,
			precursor: data.biomes?.precursor
		},
		daily_ores: {
			mined: data.daily_ores_mined,
			day: data.daily_ores_mined_day,
			ores: Object.fromEntries(
				['mithril_ore', 'gemstone'].map((type) => [
					type.split('_')[0],
					{
						day: (data[`daily_ores_mined_day_${type}` as keyof MiningCore] as number) ?? 0,
						count: (data[`daily_ores_mined_${type}` as keyof MiningCore] as number) ?? 0
					}
				])
			)
		},
		hotm_last_reset: data.last_reset,
		crystal_hollows_last_access: data.greater_mines_last_access,
		daily_effect: {
			effect: data.current_daily_effect,
			last_changed: data.current_daily_effect_last_changed
		},
		nodes: data.nodes ?? {}
	};
}

export function getForge(userProfile: Partial<SkyBlockProfileMember>): SkyBlockMiningData['forge'] {
	if (userProfile.forge?.forge_processes?.forge_1) {
		return {
			processes: Object.values(userProfile.forge.forge_processes.forge_1).map((process) => {
				const item: ForgeItem = {
					id: process.id,
					slot: process.slot,
					timeFinished: 0,
					timeFinishedText: ''
				};
				if (item.id in FORGE_TIMES) {
					let forgeTime = FORGE_TIMES[item.id as keyof typeof FORGE_TIMES] * 60 * 1000;
					const quickForge = userProfile.mining_core?.nodes?.forge_time;
					if (quickForge) {
						forgeTime *= QUICK_FORGE_MULTIPLIER[quickForge as Range<1, 20>];
					}
					// TODO: Implement item name database
					// const dbObject = constants.ITEMS.get(item.id);
					item.name = process.id == 'PET' ? '[Lvl 1] Ammonite' : /* dbObject ? dbObject.name : */ process.id;

					const timeFinished = process.startTime + forgeTime;
					item.timeFinished = timeFinished;
					item.timeFinishedText = moment(timeFinished).fromNow();
				} else {
					item.id = `UNKNOWN-${item.id}`;
				}
				return item;
			})
		};
	} else {
		return undefined;
	}
}

export function getMining(
	userProfile: Partial<SkyBlockProfileMember>,
	hypixelProfile: HypixelPlayerData
): SkyBlockMiningData {
	return {
		commissions: {
			milestone: userProfile.objectives?.tutorial
				? Math.max(
						...userProfile.objectives.tutorial
							.filter((objective) => objective.startsWith('commission_milestone_reward_skyblock_xp_tier_'))
							.map((objective) => parseInt(objective.split('_').pop() ?? '0'))
				  )
				: 0,
			completions: hypixelProfile.achievements.skyblock_hard_working_miner ?? 0
		},
		forge: getForge(userProfile),
		core: getMiningCore(userProfile)
	};
}
