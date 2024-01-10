import type { Experimentation, SkyBlockProfileMember, SkyblockExperimentTier } from '$types/hypixel';
import { EXPERIMENTS } from '$constants';
import _ from 'lodash';

export function getEnchanting(userProfile: Partial<SkyBlockProfileMember>) {
	if (!userProfile.experimentation) return;

	return {
		unlocked: !!userProfile.experimentation,
		experiments: userProfile.experimentation
			? Object.fromEntries(
					Object.keys(EXPERIMENTS.games)
						.filter((game) => game in (userProfile.experimentation as Experimentation))
						.map((game) => {
							const gameConstants = EXPERIMENTS.games[game as keyof typeof EXPERIMENTS.games];
							const gameData = (userProfile.experimentation as Experimentation)[
								game as keyof typeof userProfile.experimentation
							] as Record<string, number>;

							const output = {
								name: gameConstants.name,
								stats: {} as Record<string, number>,
								tiers: {} as Record<number, SkyblockExperimentTier>
							};

							for (const key in gameData) {
								if (key.startsWith('attempts') || key.startsWith('claims') || key.startsWith('best_score')) {
									const statArray = key.split('_');
									const tierValue = parseInt(statArray.pop() as string);
									const tier =
										game === 'numbers' ? tierValue + 2 : game === 'simon' ? Math.min(tierValue + 1, 5) : tierValue;

									const tierInfo = _.cloneDeep(EXPERIMENTS.tiers[tier]);
									if (output.tiers[tier as keyof typeof output.tiers] === undefined) output.tiers[tier] = tierInfo;

									const stat = statArray.join('_');
									Object.assign(output.tiers[tier], {
										[stat]: gameData[key]
									});
									continue;
								}
								if (key == 'last_attempt' || key == 'last_claimed') {
									if (gameData[key] <= 0) continue;
									output.stats[key] = gameData[key];
									continue;
								}
								output.stats[key] = gameData[key];
							}

							return [game, output];
						})
			  )
			: undefined
	};
}
