export interface HypixelPlayerData {
	uuid: string;
	firstLogin: number;
	lastLogin: number;
	playername: string;
	displayname: string;
	karma: number;

	prefix?: string;
	rank?: string;
	monthlyPackageRank?: string;
	monthlyRankColor?: string;
	newPackageRank?: string;
	rankPlusColor?: string;

	socialMedia?: {
		links?: {
			DISCORD?: string;
			HYPIXEL?: string;
			[key: string]: string;
		};
	};
}
