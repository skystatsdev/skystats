export type AccessoryBagStorage = {
	tuning?: Record<AccessoryBagStorageTuningSlotIDs, AccessoryBagStorageTuningSlotData>;
	unlocked_powers?: string[];
	selected_power?: string;
	bag_upgrades_purchased?: number;
	highest_magical_power?: number;
};

type AccessoryBagStorageTuningSlotIDs = 'slot_0' | 'slot_1' | 'slot_2' | 'sllot_3';

type AccessoryBagStorageTuningSlotData = {
	health: number;
	defense: number;
	walk_speed: number;
	strength: number;
	critical_damage: number;
	critical_chance: number;
	attack_speed: number;
	intelligence: number;
};
