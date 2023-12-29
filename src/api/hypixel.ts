import { HYPIXEL_API_KEY } from '$env/static/private';
import { isUUID } from '$params/uuid';
import { REDIS } from '$redis/redis';
import { getUUID } from './mojang';

const baseURL = 'https://api.hypixel.net/v2';

//! TEMPORARY CACHE TIMES (we want to store transformed data later also, not raw data)
const playerCacheTTL = 300; // 5 minutes
const profileCacheTTL = 120; // 2 minutes

const headers = {
	'API-Key': HYPIXEL_API_KEY,
	Accept: 'application/json'
};

//! TEMPORARY EXAMPLE FUNCTIONS
// Transformed responses will be stored in a database, not cached in memory like this

export async function getPlayer(uuid: string) {
	if (isUUID(uuid) === false) {
		const playerUUID = await getUUID(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	if (await REDIS.EXISTS(`hypixel:player:${uuid}`)) {
		const data = await REDIS.GET(`hypixel:player:${uuid}`);

		if (data) {
			console.log(`Using cached player data for ${uuid}`);
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${baseURL}/player?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();
		if (data.success === false) {
			throw new Error(data.cause || 'Request to Hypixel API failed. Please try again!');
		}

		if (data.player === null) {
			throw new Error('Player not found!');
		}

		const player = data.player;

		REDIS.SETEX(`hypixel:player:${uuid}`, playerCacheTTL, JSON.stringify(player));

		return player;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getProfile(uuid: string) {
	if (isUUID(uuid) === false) {
		const playerUUID = await getUUID(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	if (await REDIS.EXISTS(`hypixel:profiles:${uuid}`)) {
		const data = await REDIS.GET(`hypixel:profiles:${uuid}`);

		if (data) {
			console.log(`Using cached profiles for ${uuid}`);
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${baseURL}/skyblock/profiles?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();

		if (data.success === false) {
			throw new Error(data.cause || 'Request to Hypixel API failed. Please try again!');
		}

		if (data.profiles === null || data.profiles.length === 0) {
			throw new Error('Player has no SkyBlock profiles.');
		}

		const profiles = data.profiles;

		REDIS.SETEX(`hypixel:profiles:${uuid}`, profileCacheTTL, JSON.stringify(profiles));

		return profiles;
	} catch (error) {
		console.error(error);
		return null;
	}
}
