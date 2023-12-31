export type SkyBlockProfileBestiary = {
	migrated_stats: boolean;
	migration: boolean;
	kills: Record<string, number>;
	deaths: Record<string, number>;
	milestone: BestiaryMilestone;
	miscellaneous: BestiaryMiscellaneous;
};

type BestiaryMilestone = {
	last_claimed_milestone: number;
};

type BestiaryMiscellaneous = {
	max_kills_visible: boolean;
};
