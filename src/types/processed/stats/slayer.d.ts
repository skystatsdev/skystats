import { SkyblockSlayerBoss } from '../../raw/profile/slayer';

export type SkyBlockStatsSlayers = {
	slayers: Record<SkyblockSlayerBoss, SkyBlockStatsSlayerData>;
	total_slayer_xp: number;
};

export type SkyBlockStatsSlayerData = {
	xp: number;
	level: number;
	maxLevel: number;
	xpForNext: number | null;
	progress: number;
	kills: Record<string, number>;
};
