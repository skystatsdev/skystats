import util from 'util';
import nbt from 'prismarine-nbt';
const parseNbt = util.promisify(nbt.parse);
import * as helper from '../../helper';

export async function processItems(base64: { data?: string }) {
	if (base64?.data === undefined) {
		return [];
	}

	const buf = Buffer.from(base64.data, 'base64');

	let data = await parseNbt(buf);
	data = nbt.simplify(data);

	const items = data.i;
	for (const item of items) {
		// ? Display Name
		if (item.tag?.display?.Name != undefined) {
			item.display_name = helper.getRawLore(item.tag.display.Name);
		}

		// ? Skull Textre Path
		if (
			Array.isArray(item.tag?.SkullOwner?.Properties?.textures) &&
			item.tag.SkullOwner.Properties.textures.length > 0
		) {
			try {
				const json = JSON.parse(Buffer.from(item.tag.SkullOwner.Properties.textures[0].Value, 'base64').toString());
				const url = json.textures.SKIN.url;
				const uuid = url.split('/').pop();

				item.texture_path = `/head/${uuid}`;
			} catch (e) {
				console.error(e);
			}
		}
	}

	return items;
}
