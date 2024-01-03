export type PlayerSkyblockProfileData = {
	uuid: string;
	name: string;
	game_mode: string;
};

export type ProfileMemberData = {
	uuid: string;
	username: string;
};

export type GetProfiles = {
	profile: SkyblockProfile;
	profiles: SkyblockProfile[];
	uuid: string;
};
