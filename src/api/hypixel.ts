import { HYPIXEL_API_KEY } from '$env/static/private';
import { IsUUID } from '$params/uuid';
import { redis } from '$redis/redis';
import { FetchUuid } from './mojang';

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
	if (IsUUID(uuid) === false) {
		const playerUUID = await FetchUuid(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	if (await redis.EXISTS(`hypixel:player:${uuid}`)) {
		const data = await redis.GET(`hypixel:player:${uuid}`);

		if (data) {
			console.log(`Using cached player data for ${uuid}`);
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${BASE_URL}/player?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();
		if (data.success === false) {
			throw new Error(data.cause || 'Request to Hypixel API failed. Please try again!');
		}

		if (data.player === null) {
			throw new Error('Player not found!');
		}

		const player = data.player;

		redis.SETEX(`hypixel:player:${uuid}`, PLAYER_CACHE_TTL, JSON.stringify(player));

		return player;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function FetchProfiles(uuid: string) {
	if (IsUUID(uuid) === false) {
		const playerUUID = await FetchUuid(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	if (await redis.EXISTS(`hypixel:profiles:${uuid}`)) {
		const data = await redis.GET(`hypixel:profiles:${uuid}`);

		if (data) {
			console.log(`Using cached profiles for ${uuid}`);
			return JSON.parse(data);
		}
	}

	const response = await fetch(`${BASE_URL}/skyblock/profiles?uuid=${uuid}`, { headers });

	try {
		const data = await response.json();

		if (data.success === false) {
			throw new Error(data.cause || 'Request to Hypixel API failed. Please try again!');
		}

		if (data.profiles === null || data.profiles.length === 0) {
			throw new Error('Player has no SkyBlock profiles.');
		}

		const profiles = data.profiles;

		redis.SETEX(`hypixel:profiles:${uuid}`, PROFILES_CACHE_TTL, JSON.stringify(profiles));

		return profiles;
	} catch (error) {
		console.error(error);
		return null;
	}
}
