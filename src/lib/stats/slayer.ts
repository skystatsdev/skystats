import * as constants from '$constants';
import type { SkyblockProfileMember, SkyblockSlayerBoss, SkyblockPlayerSlayerStats } from '$types/hypixel';

function getSlayerLevel(
	slayer: SkyblockProfileMember['slayer']['slayer_bosses'][SkyblockSlayerBoss],
	slayerName: SkyblockSlayerBoss
) {
	const xpTable = constants.SKYBLOCK_SLAYER_XP_TABLE[slayerName];

	const maxLevel = Object.keys(xpTable).length;
	const xp = slayer.xp;

	let level = 0;
	for (const levelName in slayer.claimed_levels) {
		//* Skip legacy zombie slayer levels
		if (slayerName === 'zombie' && ['level_7', 'level_8', 'level_9'].includes(levelName)) {
			continue;
		}

		const parsedLevel = parseInt(levelName.split('_').at(1) as string);
		level = Math.max(level, parsedLevel);
	}

	const kills: Record<string, number> = {};
	for (const property in slayer) {
		if (property.startsWith('boss_kills_tier_') === false) {
			continue;
		}

		const tier = parseInt(property.split('_').at(-1) as string) + 1;

		kills[tier] = slayer[property as keyof typeof slayer] as number;
	}

	kills.total = Object.values(kills).reduce((a, b) => a + b, 0);

	if (level < maxLevel) {
		const xpForNext = xpTable[(level + 1) as keyof typeof xpTable];
		const progress = xp / xpForNext;

		return Object.assign(constants.SLAYER_INFO[slayerName], { xp, level, maxLevel, xpForNext, progress, kills });
	}

	return Object.assign(constants.SLAYER_INFO[slayerName], { xp, level, maxLevel, xpForNext: null, progress: 1, kills });
}

export function getSlayers(userProfile: Partial<SkyblockProfileMember>): SkyblockPlayerSlayerStats {
	const output = { slayers: {} as SkyblockPlayerSlayerStats['slayers'], total_slayer_xp: 0 };
	if (userProfile.slayer?.slayer_bosses === undefined) {
		return output;
	}

	for (const [slayerName, slayer] of Object.entries(userProfile.slayer.slayer_bosses)) {
		output.slayers[slayerName as SkyblockSlayerBoss] = getSlayerLevel(slayer, slayerName as SkyblockSlayerBoss);
	}

	output.total_slayer_xp = Object.values(output.slayers).reduce((a, b) => a + b.xp, 0);

	return output;
}
