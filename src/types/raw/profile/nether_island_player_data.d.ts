export type SkyblockProfileNetherIslandPlayerData = {
	kuudra_completed_tiers: KuudraCompletedTiers;
	dojo: Record<string, number>;
	abiphone: Abiphone;
	matriarch: CrimsonIsleMatriarch;
	selected_faction: CrimsonIsleFactions;
	mages_reputation: number;
	barbarians_reputation: number;
	last_minibosses_killed: string[];
	kuudra_party_finder: KuudraPartyFinder;
};

type KuudraCompletedTiers = {
	none: number;
	hot: number;
	burning: number;
	fiery: number;
	infernal: number;
	highest_wave_infernal: number;
	highest_wave_none: number;
};

type CrimsonIsleFactions = 'mages' | 'barbarians';

type Abiphone = {
	contact_data: Record<string, AbiphoneContactData>;
	games: AbiphoneGames;
	active_contacts: string[];
	operator_chip: AbiphoneOperatorChip;
	trio_contact_addons: number;
	selected_ringtone: string;
};

type AbiphoneContactData = {
	talked_to: boolean;
	completed_quest: boolean;
};

type AbiphoneGames = {
	tic_tac_toe_draws: number;
	snake_best_score: number;
};

type AbiphoneOperatorChip = {
	repaired_index: number;
};

type KuudraPartyFinder = {
	group_builder: KuudraGroupBuilder;
};

type KuudraGroupBuilder = {
	tier: string;
	note: string;
	combat_level_required: number;
};

type CrimsonIsleMatriarch = {
	pearls_collected: number;
	last_attempt: number;
	recent_refreshes: number[];
};
