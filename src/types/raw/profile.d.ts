import {
	SkyBlockProfileRift,
	SkyblockProfilePlayerData,
	SkyblockProfileAccessoryBagStorage,
	SkyblockProfileLeveling,
	SkyBlockProfileItemData,
	SkyblockProfileJacobsContest,
	SkyblockProfileCurrencies,
	SkyblockProfileDungeons,
	SkyBlockProfileProfile,
	SkyblockProfilePetsData,
	SkyblockProfileNetherIslandPlayerData,
	SkyBlockProfileExperimentation,
	SkyblockProfileMiningCore,
	SkyBlockProfileBestiary,
	SkyBlockProfileQuests,
	SkyBlockProfilePlayerStats,
	SkyBlockProfileForge,
	SkyBlockProfileFairySouls,
	SkyBlockProfileObjectives,
	SkyBlockProfileSlayer,
	SkyBlockProfileTrophyFish,
	SkyBlockProfileInventory,
	SkyblockProfileBanking,
	SkyBlockProfileCommunityUpgrades
} from './profile/index.d.ts';

export type SkyblockProfile = {
	profile_id: string;
	cute_name: string;
	game_mode?: string;
	community_upgrades: SkyBlockProfileCommunityUpgrades;
	members: Record<string, Partial<SkyblockProfileMember>>;
	banking: SkyblockProfileBanking;
	selected?: boolean;
};

export type SkyblockProfileMember = {
	rift: SkyBlockProfileRift;
	player_data: SkyblockProfilePlayerData;
	accessory_bag_storage: SkyblockProfileAccessoryBagStorage;
	leveling: SkyblockProfileLeveling;
	item_data: SkyBlockProfileItemData;
	jacobs_contest: SkyblockProfileJacobsContest;
	currencies: SkyblockProfileCurrencies;
	dungeons: SkyblockProfileDungeons;
	profile: SkyBlockProfileProfile;
	pets_data: SkyblockProfilePetsData;
	player_id: string;
	nether_island_player_data: SkyblockProfileNetherIslandPlayerData;
	experimentation: SkyBlockProfileExperimentation;
	mining_core: SkyblockProfileMiningCore;
	bestiary: SkyBlockProfileBestiary;
	quests: SkyBlockProfileQuests;
	player_stats: SkyBlockProfilePlayerStats;
	forge: SkyBlockProfileForge;
	fairy_soul: SkyBlockProfileFairySouls;
	objectives: SkyBlockProfileObjectives;
	slayer: SkyBlockProfileSlayer;
	trophy_fish: SkyBlockProfileTrophyFish;
	inventory: SkyBlockProfileInventory;
	collection: Record<string, number>;
};
