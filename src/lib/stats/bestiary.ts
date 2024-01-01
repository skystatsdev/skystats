import * as constants from '$constants';
import type { SkyblockProfileMember } from '$types/hypixel';

function formatBestiaryKills(kills: Record<string, number>, mobs: (typeof constants.BESTIARY)['dynamic']['mobs']) {
	const output = [];
	for (const mob of mobs) {
		const totalKills = mob.mobs.reduce((acc, cur) => acc + (kills[cur] ?? 0), 0);
		const mobBracket = constants.BESTIARY_BRACKETS[mob.bracket];
		const maxKills = mob.cap;
		const nextTierKills = mobBracket.find((tier) => totalKills < tier && tier <= maxKills);
		const tier = nextTierKills ? mobBracket.indexOf(nextTierKills) : mobBracket.indexOf(maxKills) + 1;
		const maxTier = mobBracket.indexOf(maxKills) + 1;

		output.push({
			name: mob.name,
			texture: mob.texture,
			kills: totalKills,
			nextTierKills: nextTierKills ?? null,
			maxKills: maxKills,
			tier: tier,
			maxTier: maxTier
		});
	}

	return output;
}

export function getBestiary(userProfile: Partial<SkyblockProfileMember>) {
	const output = {
		bestiary: {} as Record<
			string,
			{
				name: string;
				texture: string;
				mobs: {
					name: string;
					texture: string;
					kills: number;
					nextTierKills: number | null;
					maxKills: number;
					tier: number;
					maxTier: number;
				}[];
				mobsUnlocked: number;
				mobsMaxed: number;
			}
		>,
		milestone: 0,
		maxMilestone: 0,
		tiers: 0,
		totalTiers: 0
	};
	if (userProfile?.bestiary?.kills === undefined) {
		return output;
	}

	for (const [category, data] of Object.entries(constants.BESTIARY)) {
		output.bestiary[category] = {
			name: data.name,
			texture: data.texture,
			mobs: formatBestiaryKills(userProfile.bestiary.kills, data.mobs),
			mobsUnlocked: 0,
			mobsMaxed: 0
		};

		output.bestiary[category].mobsUnlocked = output.bestiary[category].mobs.filter((m) => m.kills > 0).length;
		output.bestiary[category].mobsMaxed = output.bestiary[category].mobs.filter((m) => m.tier === m.maxTier).length;
	}

	const mobs = Object.values(output.bestiary).flatMap((category) => Object.values(category.mobs));

	const tiers = mobs.reduce((total, mob) => total + mob.tier, 0);
	const totalTiers = mobs.reduce((total, mob) => total + mob.maxTier, 0);

	return {
		bestiary: output,
		tiers,
		totalTiers,
		milestone: tiers / 10,
		maxMilestone: totalTiers / 10
	};
}
