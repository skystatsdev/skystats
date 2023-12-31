import { SkyblockNBTData } from './inventory';

export type SkyBlockProfileRift = {
	village_plaza?: RiftVillagePlaza;
	wither_cage?: RiftWitherCage;
	black_lagoon?: RiftBlackLagoon;
	dead_cats?: RiftDeadCat;
	wizard_tower?: RiftWizardTower;
	enigma?: RiftEnigma;
	gallery?: RiftGallery;
	slayer_quest?: RiftSlayerQuest;
	lifetime_purchased_boundaries?: string[];
	west_village?: RiftWestVillage;
	wyld_woods?: RiftWyldWoods;
	castle?: RiftCastle;
	access?: RiftAccess;
	dreadfarm?: RiftDreadfarm;
	inventory?: RiftInventory;
};

export type RiftAccess = {
	last_free?: number;
	consumed_prism?: boolean;
};

export type RiftBlackLagoon = {
	talked_to_edwin?: boolean;
	received_science_paper?: boolean;
	delivered_science_paper?: boolean;
	completed_step?: number;
};

export type RiftCastle = {
	unlocked_pathway_skip?: boolean;
	fairy_step?: number;
	grubber_stacks?: number;
};

export type RiftDeadCat = {
	talked_to_jacquelle?: boolean;
	picked_up_detector?: boolean;
	found_cats?: string[];
	unlocked_pet?: boolean;
	montezuma?: RiftMontezuma;
};

export type RiftMontezuma = {
	uuid: null;
	uniqueId: string;
	type: string;
	exp: number;
	active: boolean;
	tier: string;
	heldItem: null;
	candyUsed: number;
	skin: null;
};

export type RiftDreadfarm = {
	shania_stage?: number;
	caducous_feeder_uses: ?number[];
};

export type RiftEnigma = {
	bought_cloak?: boolean;
	found_souls?: string[];
	claimed_bonus_index?: number;
};

export type RiftGallery = {
	elise_step?: number;
	secured_trophies?: RiftSecuredTrophy[];
	sent_trophy_dialogues?: string[];
};

export type RiftSecuredTrophy = {
	type?: string;
	timestamp?: number;
	visits?: number;
};

export type RiftInventory = {
	inv_contents?: SkyblockNBTData;
	inv_armor?: SkyblockNBTData;
	ender_chest_contents?: SkyblockNBTData;
	ender_chest_page_icons?: SkyblockNBTData;
	equipment_contents?: SkyblockNBTData;
};

export type RiftEnderChestContents = {
	type?: number;
	data?: string;
};

export type RiftSlayerQuest = {
	type?: string;
	tier?: number;
	start_timestamp?: number;
	completion_state?: number;
	used_armor?: boolean;
	solo?: boolean;
};

export type RiftVillagePlaza = {
	murder?: RiftMurder;
	barry_center?: RiftBarryCenter;
	cowboy?: RiftCowboy;
	lonely?: RiftLonely;
	seraphine?: RiftSeraphine;
	got_scammed?: Riftboolean;
};

export type RiftBarryCenter = {
	first_talk_to_barry?: boolean;
	convinced?: string[];
	received_reward?: boolean;
};

export type RiftCowboy = {
	stage?: number;
	hay_eaten?: number;
	rabbit_name?: string;
	ed_carrots?: number;
};

export type RiftLonely = {
	seconds_sitting?: number;
};

export type RiftMurder = {
	step_index?: number;
	room_clues?: string[];
};

export type RiftSeraphine = {
	step_index?: number;
};

export type RiftWestVillage = {
	crazy_kloon?: RiftCrazyKloon;
	mirrorverse?: RiftMirrorverse;
	kat_house?: RiftKatHouse;
	glyphs?: RiftGlyphs;
};

export type RiftCrazyKloon = {
	selected_colors?: RiftSelectedColors;
	talked?: boolean;
	hacked_terminals?: string[];
	quest_complete?: boolean;
};

export type RiftSelectedColors = {
	one?: string;
	two?: string;
	three?: string;
	four?: string;
	five?: string;
	six?: string;
	seven?: string;
	eight?: string;
};

export type RiftGlyphs = {
	claimed_wand?: boolean;
	current_glyph_delivered?: boolean;
	current_glyph_completed?: boolean;
	current_glyph?: number;
	completed?: boolean;
	claimed_bracelet?: boolean;
};

export type RiftKatHouse = {
	bin_collected_silverfish?: number;
	bin_collected_mosquito?: number;
	bin_collected_spider?: number;
};

export type RiftMirrorverse = {
	visited_rooms?: string[];
	upside_down_hard?: boolean;
	claimed_chest_items?: string[];
	claimed_reward?: boolean;
};

export type RiftWitherCage = {
	killed_eyes?: string[];
};

export type RiftWizardTower = {
	wizard_quest_step?: number;
	crumbs_laid_out?: number;
};

export type RiftWyldWoods = {
	sirius_started_q_a?: boolean;
	sirius_q_a_chain_done?: boolean;
	sirius_completed_q_a?: boolean;
	bughunter_step?: number;
	talked_threebrothers?: string[];
};
