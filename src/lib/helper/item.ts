import type { SkyBlockDBItem, SkyBlockItem, SkyBlockItemQuery } from '$types/hypixel';
import * as constants from '$constants/items';
import sanitize from 'mongo-sanitize';
import * as helper from '../helper';

/**
 * Gathers Item Data visualized similarily to in-game NBT format based on a query
 * @param {Object} query Query with optional properties
 * @param {string} [query.skyblockId] Item SkyBlock ID
 * @param {number} [query.id] Item Vanilla ID
 * @param {string} [query.name] Item name
 * @param {number} [query.damage] Item damage value
 * @returns {*} Item Data
 */
export async function getItemData(query: SkyBlockItemQuery) {
	query = Object.assign({ skyblockId: undefined, id: undefined, name: undefined, damage: undefined }, query);
	const item: SkyBlockItem = { id: -1, damage: 0, Count: 1, tag: { ExtraAttributes: {} } };
	let dbItem: SkyBlockDBItem;

	if (query.skyblockId) {
		query.skyblockId = sanitize(query.skyblockId);

		if (query.skyblockId.includes(':')) {
			const split = query.skyblockId.split(':');

			query.skyblockId = split[0];
			query.damage = Number(split[1]);
		}

		dbItem = { ...item, ...constants.ITEMS.get(query.skyblockId) };
	}

	if (query && query.name !== undefined) {
		const results = Object.values(constants.ITEMS);

		const filteredResults = results.filter((a) => a.name.toLowerCase() == (query.name ?? '').toLowerCase());

		if (filteredResults.length > 0) {
			dbItem = filteredResults[0] ?? {};
		}
	}

	// Required otherwise TS will complain about dbItem potentially being undefined
	dbItem ??= {};

	if (query.id !== undefined) {
		item.id = query.id;
	}

	if (query.name !== undefined) {
		item.tag.display = { Name: query.name };
	}

	if ('item_id' in dbItem) {
		item.id = dbItem.item_id as number;
	}

	if ('damage' in dbItem) {
		item.damage = query.damage ?? (dbItem.damage as number);
	}

	if ('name' in dbItem) {
		item.tag.display = { Name: dbItem.name as string };
	}

	if ('id' in dbItem) {
		item.tag.ExtraAttributes.id = dbItem.skyblock_id;
	}

	if ('texture' in dbItem) {
		item.texture = dbItem.texture as string;
	}

	if (dbItem.id && dbItem.id >= 298 && dbItem.id <= 301) {
		const type = ['helmet', 'chestplate', 'leggings', 'boots'][dbItem.id - 298];

		if (dbItem.color !== undefined) {
			const color = helper.rgbToHex(dbItem.color) ?? '955e3b';

			item.texture_path = `/leather/${type}/${color}`;
		}
	}

	return item;
}
