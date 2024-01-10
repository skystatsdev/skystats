export type SkyblockExperimentTier = {
	name: string;
	icon: string;
	attempts?: number;
	claims?: number;
	best_score?: number;
};

export type SkyblockEnchantingData = {
	unlocked: boolean;
	experiments?: Record<
		string,
		{
			name: string;
			stats: {
				last_claimed?: number;
				last_attempt?: number;
				bonus_clicks?: number;
			};
			tiers: Record<number, SkyblockExperimentTier>;
		}
	>;
};
