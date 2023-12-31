export type SkyBlockProfileInventory = {
	inv_contents?: NBTData;
	ender_chest_contents?: NBTData;
	backpack_icons?: Record<string, NBTData>;
	bag_contents?: Record<BagContentsType, NBTData>;
	inv_armor?: NBTData;
	equipment_contents?: NBTData;
	personal_vault_contents?: NBTData;
	wardrobe_equipped_slot?: number;
	backpack_contents?: Record<string, NBTData>;
	sacks_counts?: Record<string, number>;
	wardrobe_contents?: NBTData;
};

type BagContentsType = 'potion_bag' | 'talisman_bag' | 'fishing_bag' | 'quiver';

export type NBTData = {
	type: number;
	data: string;
};
