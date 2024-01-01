import type { SkyblockProfileMember } from '$types/hypixel';
import { processItems } from './items/items';

function getPath(object: any, path: string[]): unknown {
	let output = object;

	for (const key of path) {
		if (output === undefined) {
			return undefined;
		}

		output = output[key];
	}

	return output;
}

export async function getItems(userProfile: Partial<SkyblockProfileMember>) {
	const output = {
		inventory: []
	};
	console.log(userProfile.inventory);

	const inventoryTypes = [
		{ name: 'Inventory', path: ['inventory', 'inv_contents'] },
		{ name: 'Ender Chest', path: ['inventory', 'ender_chest_contents'] },
		{ name: 'Armor', path: ['inventory', 'inv_armor'] },
		{ name: 'Equipment', path: ['inventory', 'equipment_contents'] },
		{ name: 'Personal Vault', path: ['inventory', 'personal_vault_contents'] },

		{ name: 'Potion Bag', path: ['inventory', 'bag_contents', 'potion_bag'] },
		{ name: 'Accessory Bag', path: ['inventory', 'bag_contents', 'talisman_bag'] },
		{ name: 'Fishing Bag', path: ['inventory', 'bag_contents', 'fishing_bag'] },
		{ name: 'Quiver', path: ['inventory', 'bag_contents', 'quiver'] },
		{ name: 'Candy Bag', path: ['inventory', 'shared_inventory', 'candy_inventory_contents'] }
	];

	for (const inventoryType of inventoryTypes) {
		const key = inventoryType.name.replace(' ', '_').toLowerCase();

		const data = getPath(userProfile, inventoryType.path);

		output[key] = await processItems(data);
	}

	return output;
}
