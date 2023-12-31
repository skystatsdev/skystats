import { RANK_PLUS_COLORS, type PlusColor, type RankName, RANKS, type RankInformation } from '$constants/ranks';
import type { StoredPlayerData } from '$mongo/collections';
import type { HypixelPlayerData } from '$types/hypixel';

export function parsePlayerData(player: HypixelPlayerData): StoredPlayerData {
	return {
		rank: getRankInfo(player),
		unparsed: player,
		lastUpdated: Math.floor(Date.now() / 1000)
	};
}

export function getRankInfo(player: HypixelPlayerData): RankInformation | undefined {
	const rank = getRankName(player);
	if (!rank) return undefined;

	const defaults = RANKS[rank];

	if (rank === 'SUPERSTAR' && player.monthlyRankColor === 'AQUA') {
		return {
			...defaults,
			color: '#33aec3'
		};
	}

	return defaults;
}

export function getRankName(player: HypixelPlayerData): RankName | undefined {
	if (player.prefix) {
		// Clean extraneous color codes (ex: §c[OWNER] -> OWNER)
		const match = player.prefix.replace(/§\w/g, '').match(/\[(.+?)\]/);
		if (match) {
			return match[1] as RankName;
		}
	}

	if (player.rank && player.rank !== 'NORMAL') {
		return player.rank as RankName;
	}

	if (player.monthlyPackageRank && player.monthlyPackageRank !== 'NONE') {
		return player.monthlyPackageRank as RankName;
	}

	if (player.newPackageRank && player.newPackageRank !== 'NONE') {
		return player.newPackageRank as RankName;
	}

	return undefined;
}

export function getRankDefaults(rank?: RankName) {
	if (!rank) return undefined;

	return RANKS[rank];
}

export function convertPlusColorToHex(color?: PlusColor) {
	if (!color) return undefined;

	return RANK_PLUS_COLORS[color];
}
