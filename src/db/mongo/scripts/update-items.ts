import { MONGO } from '../mongo';

const updateInterval = 1000 * 60 * 60 * 12; // 12 hours
const baseHeaders = {
	Accept: 'application/json',
	'User-Agent': 'SkyStats'
};

async function updateItems() {
	try {
		const timeNow = Date.now();
		const response = await fetch('https://api.slothpixel.me/api/skyblock/items', {
			headers: baseHeaders
		});
		const data = await response.json();

		const items = Object.keys(data).map((skyblockId) => {
			const skyblockItem = data[skyblockId];

			const item = {
				skyblock_id: skyblockId,
				id: data.item_id,
				damage: 0,
				tier: 'common'
			};

			return Object.assign(item, skyblockItem);
		});

		await Promise.all(
			items.map((item) => MONGO.collection('items').updateOne({ id: item.id }, { $set: item }, { upsert: true }))
		);

		console.log(`[ITEMS] Retrieved items in ${(Date.now() - timeNow).toLocaleString()}ms`);
	} catch (e) {
		console.error(e);
	}

	setTimeout(updateItems, updateInterval);
}

updateItems();
