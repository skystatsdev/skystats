export const UPGRADE_TYPES = {
	mithril_powder: {
		name: 'Mithril Powder',
		color: '2'
	},
	gemstone_powder: {
		name: 'Gemstone Powder',
		color: 'd'
	},
	token_of_the_mountain: {
		name: 'Token of the Mountain',
		color: '5'
	},
	free: {
		name: 'FREE',
		color: 'a'
	}
};

const rewards = {
	hotm: {
		1: {
			token_of_the_mountain: 1
		},
		2: {
			token_of_the_mountain: 2,
			access_to_forge: 0,
			new_forgeable_items: 0
		},
		3: {
			token_of_the_mountain: 2,
			forge_slot: 1,
			new_forgeable_items: 0,
			access_crystal_hollows: 0,
			emissary_braum_crystal_hollows: 0
		},
		4: {
			token_of_the_mountain: 2,
			forge_slot: 1,
			new_forgeable_items: 0
		},
		5: {
			token_of_the_mountain: 2,
			new_forgeable_items: 0
		},
		6: {
			token_of_the_mountain: 2,
			new_forgeable_items: 0
		},
		7: {
			token_of_the_mountain: 3,
			new_forgeable_items: 0
		}
	},
	potm: {
		1: {
			pickaxe_ability_level: 1,
			token_of_the_mountain: 1,
			skyblock_experience: 25
		},
		2: {
			forge_slot: 1,
			skyblock_experience: 35
		},
		3: {
			commission_slot: 1,
			skyblock_experience: 50
		},
		4: {
			mithril_powder_when_mining_mithril: 1,
			skyblock_experience: 65
		},
		5: {
			token_of_the_mountain: 1,
			skyblock_experience: 75
		},
		6: {
			gemstone_powder_when_mining_gemstones: 2,
			skyblock_experience: 100
		},
		7: {
			token_of_the_mountain: 1,
			skyblock_experience: 125
		}
	},
	rewards: {
		token_of_the_mountain: {
			formatted: '§5Token of the Mountain',
			qtyColor: '5'
		},
		access_to_forge: {
			formatted: '§eAccess to the Forge',
			qtyColor: 'e'
		},
		new_forgeable_items: {
			formatted: '§eNew Forgeable Items',
			qtyColor: 'e'
		},
		forge_slot: {
			formatted: '§aForge Slot',
			qtyColor: 'a'
		},
		access_crystal_hollows: {
			formatted: '§dAccess to the §5Crystal Hollows',
			qtyColor: 'd'
		},
		emissary_braum_crystal_hollows: {
			formatted: '§eEmissary Braum §f- §bCrystal Hollows',
			qtyColor: 'e'
		},
		pickaxe_ability_level: {
			formatted: '§cPickaxe Ability Level',
			qtyColor: 'c'
		},
		commission_slot: {
			formatted: '§aCommission Slot',
			qtyColor: 'a'
		},
		mithril_powder_when_mining_mithril: {
			formatted: '§2Mithril Powder §7when mining §fMithril',
			qtyColor: '2'
		},
		gemstone_powder_when_mining_gemstones: {
			formatted: '§dGemstone Powder §7when mining §dGemstones',
			qtyColor: 'd'
		},
		skyblock_experience: {
			formatted: '§bSkyblock XP',
			qtyColor: 'b'
		}
	}
};

const nodeNames = {
	mining_speed_2: 'Mining Speed II',
	powder_buff: 'Powder Buff',
	mining_fortune_2: 'Mining Fortune II',
	vein_seeker: 'Vein Seeker',
	lonesome_miner: 'Lonesome Miner',
	professional: 'Professional',
	mole: 'Mole',
	fortunate: 'Fortunate',
	great_explorer: 'Great Explorer',
	maniac_miner: 'Maniac Miner',
	goblin_killer: 'Goblin Killer',
	special_0: 'Peak of the Mountain',
	star_powder: 'Star Powder',
	daily_effect: 'Sky Mall',
	mining_madness: 'Mining Madness',
	mining_experience: 'Seasoned Mineman',
	efficient_miner: 'Efficient Miner',
	experience_orbs: 'Orbiter',
	front_loaded: 'Front Loaded',
	precision_mining: 'Precision Mining',
	random_event: 'Luck of the Cave',
	daily_powder: 'Daily Powder',
	fallen_star_bonus: 'Crystallized',
	mining_speed_boost: 'Mining Speed Boost',
	titanium_insanium: 'Titanium Insanium',
	mining_fortune: 'Mining Fortune',
	forge_time: 'Quick Forge',
	pickaxe_toss: 'Pickobulus',
	mining_speed: 'Mining Speed'
};

export const HOTM = {
	tiers: Object.keys(rewards.hotm).length,
	rewards: rewards,
	names: nodeNames
};

export const PRECURSOR_PARTS = {
	ELECTRON_TRANSMITTER: 'Electron Transmitter',
	FTX_3070: 'FTX 3070',
	ROBOTRON_REFLECTOR: 'Robotron Reflector',
	SUPERLITE_MOTOR: 'Superlite Motor',
	CONTROL_SWITCH: 'Control Switch',
	SYNTHETIC_HEART: 'Synthetic Heart'
};

export const COMMISSIONS_MILESTONE = 6;

export const MAX_PEAK_OF_THE_MOUNTAIN_LEVEL = 7;
