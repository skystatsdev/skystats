import { MONGO, Collections } from '$mongo/mongo';
import type { StoredPlayer, StoredPlayerData } from '$mongo/collections';

export async function getStoredPlayer(uuid: string) {
	uuid = uuid.replace(/-/g, '');

	return await MONGO.collection(Collections.Players).findOne<StoredPlayer>(
		{ id: uuid },
		{ projection: { _id: false } }
	);
}

export async function updateStoredPlayer(player: StoredPlayer) {
	const uuid = player.id.replace(/-/g, '');

	await MONGO.collection(Collections.Players).updateOne(
		{ id: uuid },
		{
			$set: {
				...player,
				id: uuid
			}
		},
		{ upsert: true }
	);
}

export async function updateStoredPlayerData(uuid: string, data: StoredPlayerData) {
	uuid = uuid.replace(/-/g, '');

	await MONGO.collection(Collections.Players).updateOne(
		{ id: uuid },
		{
			$set: {
				data
			}
		},
		{ upsert: true }
	);
}
