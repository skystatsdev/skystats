import { HYPIXEL_API_KEY } from '$env/static/private';
import { redis } from '../db/redis/redis';

const BASE_URL = 'https://api.hypixel.net/v2';

//! TEMPORARY CACHE TIMES (we want to store transformed data later also, not raw data)
const PLAYER_CACHE_TTL = 300; // 5 minutes
const PROFILES_CACHE_TTL = 120; // 2 minutes

const headers = {
	'API-Key': HYPIXEL_API_KEY,
	Accept: 'application/json'
};

//! TEMPORARY EXAMPLE FUNCTIONS
// Transformed responses will be stored in a database, not cached in memory like this

export async function FetchPlayerData(uuid: string) {
	if (await redis.EXISTS(`hypixel:player:${uuid}`)) {
		const data = await redis.GET(`hypixel:player:${uuid}`);

		if (data) {
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${BASE_URL}/player?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();
		redis.SETEX(`hypixel:player:${uuid}`, PLAYER_CACHE_TTL, JSON.stringify(data));

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function FetchProfiles(uuid: string) {
	if (await redis.EXISTS(`hypixel:profiles:${uuid}`)) {
		const data = await redis.GET(`hypixel:profiles:${uuid}`);

		if (data) {
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${BASE_URL}/skyblock/profiles?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();

		if (data.success === false) {
			return null;
		}

		redis.SETEX(`hypixel:profiles:${uuid}`, PROFILES_CACHE_TTL, JSON.stringify(data));

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
