import * as SkyBlockProfileMember from './profile/index';
import * as SkyBlockProfile from './profile/index';
export * from './profile/index';
export * from './profile/index';

export type SkyBlockProfile = {
	profile_id: string;
	cute_name: string;
	game_mode?: string;
	community_upgrades: SkyBlockProfile.CommunityUpgrades;
	members: Record<string, Partial<SkyBlockProfileMember>>;
	banking: SkyBlockProfile.Banking;
	selected?: boolean;
};

export type SkyBlockProfileMember = {
	rift: SkyBlockProfileMember.Rift;
	player_data: SkyBlockProfileMember.PlayerData;
	accessory_bag_storage: SkyBlockProfileMember.AccessoryBagStorage;
	leveling: SkyBlockProfileMember.Leveling;
	item_data: SkyBlockProfileMember.ItemData;
	jacobs_contest: SkyBlockProfileMember.JacobsContest;
	currencies: SkyBlockProfileMember.Currencies;
	dungeons: SkyBlockProfileMember.Dungeons;
	profile: SkyBlockProfileMember.Profile;
	pets_data: SkyBlockProfileMember.PetsData;
	player_id: string;
	nether_island_player_data: SkyBlockProfileMember.NetherIslandPlayerData;
	experimentation: SkyBlockProfileMember.Experimentation;
	mining_core: SkyBlockProfileMember.MiningCore;
	bestiary: SkyBlockProfileMember.Bestiary;
	quests: SkyBlockProfileMember.Quests;
	player_stats: SkyBlockProfileMember.PlayerStats;
	forge: SkyBlockProfileMember.Forge;
	fairy_soul: SkyBlockProfileMember.FairySouls;
	objectives: SkyBlockProfileMember.Objectives;
	slayer: SkyBlockProfileMember.Slayer;
	trophy_fish: SkyBlockProfileMember.TrophyFish;
	inventory: SkyBlockProfileMember.Inventory;
	collection: Record<string, number>;
};
