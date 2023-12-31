import type { SkyblockPlayerSkillStats, SkyblockProfileMember } from '$types/hypixel';

export interface StoredProfileMember {
	id: {
		player: string;
		profile: string;
	};
	api: APISettings;
	cuteName: string;
	selected: boolean;
	removed: boolean;
	stats: StoredProfileMemberData;
	lastUpdated: number;
}

export interface StoredProfileMemberData {
	skills?: SkyblockPlayerSkillStats;
	collections?: Record<string, number>;
	unparsed: Partial<SkyblockProfileMember>;
}

export interface StoredProfile {
	id: string;
	banking: StoredProfileBanking;
	craftedMinions: string[];
	gameMode: string;
	members: ProfileMemberDetails[];
	lastUpdated: number;
}

export interface StoredProfileBanking {
	balance: number;
}

export interface ProfileMemberDetails {
	ign: string;
	uuid: string;
	removed?: boolean;
}

export interface ProfileDetails extends StoredProfile {
	cuteName: string;
	selected: boolean;
	removed: boolean;
}

export interface StoredPlayer {
	id: string;
	name: string;
	textures: string;
	data?: StoredPlayerData;
	lastUpdated: number;
}

export interface StoredPlayerData {
	rank: RankInformation;
	unparsed: HypixelPlayerData;
	lastUpdated: number;
}

export interface APISettings {
	skills: boolean;
	collections: boolean;
	inventory: boolean;
	vault: boolean;
	museum: boolean;
}
