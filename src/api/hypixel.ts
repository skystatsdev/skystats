import { HYPIXEL_API_KEY } from '$env/static/private';
import { MONGO } from '$mongo/mongo';
import { isUUID } from '$params/uuid';
import type { HypixelRequestOptions, SkyblockProfile, StoredHypixelPlayer, StoredSkyblockProfile } from '$types';
import { getUUID } from '$api/mojang';

const baseURL = 'https://api.hypixel.net/v2';

//! TEMPORARY CACHE TIMES (we want to store transformed data later also, not raw data)
const playerCacheTTL = 300; // 5 minutes
const profileCacheTTL = 120; // 2 minutes

const baseHeaders = {
	Accept: 'application/json',
	'User-Agent': 'SkyStats'
};

let completedFirstRequest = false;
const ratelimit = {
	limit: 0,
	remaining: 0,
	reset: 0
};

//! TEMPORARY EXAMPLE FUNCTIONS
// Transformed responses will be stored in a database, not cached in memory like this

async function hypixelRequest(opts: HypixelRequestOptions = { usesApiKey: true }) {
	if (!opts.endpoint) throw new Error('No endpoint provided!');
	if (!opts.query) opts.query = {};
	const requestUrl = `${baseURL}/${opts?.endpoint}?${new URLSearchParams(opts.query)}`;

	if (ratelimit.remaining === 0 && completedFirstRequest) {
		throw new Error('Ratelimit reached!');
	}

	const headers: { Accept: string; 'User-Agent': string; 'API-Key'?: string } = {
		...baseHeaders
	};

	if (opts.usesApiKey) {
		headers['API-Key'] = HYPIXEL_API_KEY;
	}

	const response = await fetch(requestUrl, {
		headers
	});

	try {
		const data = await response.json();

		if (data.success === false) {
			throw new Error(data.cause || 'Request to Hypixel API failed. Please try again!');
		}
		// TODO: Handle ratelimiting in an actually good way 💀
		if (opts.usesApiKey) {
			ratelimit.limit = parseInt(response.headers.get('ratelimit-limit') as string);
			ratelimit.remaining = parseInt(response.headers.get('ratelimit-remaining') as string);
			ratelimit.reset = parseInt(response.headers.get('ratelimit-reset') as string);
			if (completedFirstRequest === false) completedFirstRequest = true;
		}

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPlayer(uuid: string): Promise<Record<any, any>> {
	if (isUUID(uuid) === false) {
		const playerUUID = await getUUID(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	const storedPlayer = await MONGO.collection<StoredHypixelPlayer>('players').findOne({ uuid });
	if (storedPlayer && storedPlayer.lastUpdated + playerCacheTTL > Math.floor(Date.now() / 1000)) {
		console.log('Returning cached player data');
		return storedPlayer.player;
	}

	const player = await hypixelRequest({ endpoint: 'player', query: { uuid }, usesApiKey: true })
		.then((res) => res.player)
		.catch((err) => {
			throw new Error(err);
		});

	if (!player) throw new Error('Player not found!');

	await MONGO.collection<StoredHypixelPlayer>('players').updateOne(
		{ uuid },
		{ $set: { uuid, player, lastUpdated: Math.floor(Date.now() / 1000) } },
		{ upsert: true }
	);

	return player;
}

export async function getProfile(uuid: string): Promise<Record<string, any>> {
	if (isUUID(uuid) === false) {
		const playerUUID = await getUUID(uuid);
		if (playerUUID === null) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	const storedProfiles = await MONGO.collection<StoredSkyblockProfile>('profiles')
		.find({ [`profile.members.${uuid}`]: { $exists: true } })
		.toArray();
	if (storedProfiles.length && storedProfiles.every((profile) => profile.lastUpdated + profileCacheTTL > Date.now())) {
		console.log('Returning cached profile data');
		return storedProfiles.map((profile) => profile.profile);
	}

	const profiles = await hypixelRequest({ endpoint: 'skyblock/profiles', query: { uuid }, usesApiKey: true })
		.then((res) => res.profiles)
		.catch((err) => {
			throw new Error(err);
		});

	if (!profiles) throw new Error('Profiles not found!');
	if (profiles.length === 0) throw new Error('Player has no profiles!');

	for (const profile of profiles as SkyblockProfile[]) {
		await MONGO.collection<StoredSkyblockProfile>('profiles').updateOne(
			{ profile_id: profile.profile_id },
			{ $set: { profile_id: profile.profile_id, profile, lastUpdated: Math.floor(Date.now() / 1000) } },
			{ upsert: true }
		);
	}

	return profiles;
}
