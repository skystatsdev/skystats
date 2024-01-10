import { HYPIXEL_API_KEY } from '$env/static/private';
import { isUUID } from '$params/uuid';
import type { HypixelRequestOptions, SkyBlockProfile } from '$types/hypixel';
import { getUUID } from '$api/mojang';
import { getStoredPlayer, updateStoredPlayerData } from '$mongo/players';
import type { ProfileDetails, StoredPlayer, StoredProfile, StoredProfileMember } from '$mongo/collections';
import type { HypixelPlayerResponse } from '$types/hypixel';
import { parsePlayerData } from '$lib/player';
import { getStoredProfileMember, getStoredProfiles } from '$mongo/profiles';
import { parseProfilesResponse } from './profiles';
import { dev } from '$app/environment';
import { REDIS } from '$redis/redis';

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

async function hypixelRequest<T = unknown>(opts: HypixelRequestOptions = { usesApiKey: true }) {
	if (!opts.endpoint) throw new Error('No endpoint provided!');
	if (!opts.query) opts.query = {};

	const requestUrl = `${baseURL}/${opts?.endpoint}?${new URLSearchParams(opts.query)}`;

	if (dev) {
		// Use redis to cache requests in dev mode for easy reparsing of data
		const cachedRequest = await REDIS.GET(`dev:hypixelrequest:${requestUrl}`);
		if (cachedRequest) {
			return JSON.parse(cachedRequest) as T;
		}
	}

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

		if (dev) {
			// Store request in redis if in dev mode
			REDIS.SETEX(`dev:hypixelrequest:${requestUrl}`, profileCacheTTL, JSON.stringify(data));
		}

		// TODO: Handle ratelimiting in an actually good way 💀
		if (opts.usesApiKey) {
			ratelimit.limit = parseInt(response.headers.get('ratelimit-limit') as string);
			ratelimit.remaining = parseInt(response.headers.get('ratelimit-remaining') as string);
			ratelimit.reset = parseInt(response.headers.get('ratelimit-reset') as string);
			if (completedFirstRequest === false) completedFirstRequest = true;
		}

		return data as T;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getPlayer(uuid: string): Promise<StoredPlayer | null> {
	if (!isUUID(uuid)) {
		const playerUUID = await getUUID(uuid);

		if (!playerUUID) {
			throw new Error('Player not found!');
		}

		uuid = playerUUID;
	}

	const storedPlayer = await getStoredPlayer(uuid);

	if (!dev && storedPlayer?.data?.lastUpdated && !outOfDateSeconds(storedPlayer.data.lastUpdated, playerCacheTTL)) {
		return storedPlayer;
	}

	return await fetchPlayerData(uuid);
}

async function fetchPlayerData(uuid: string) {
	const player = await hypixelRequest<HypixelPlayerResponse>({
		endpoint: 'player',
		query: { uuid },
		usesApiKey: true
	});

	if (!player) throw new Error('Player not found!');

	const mapped = parsePlayerData(player.player);
	await updateStoredPlayerData(uuid, mapped);

	return await getStoredPlayer(uuid);
}

export async function getProfiles(paramPlayer: string): Promise<ProfileDetails[]> {
	const uuid = await getUUID(paramPlayer);
	if (!uuid) {
		throw new Error('Player not found!');
	}

	const profiles = await getStoredProfiles(uuid);

	if (profilesNeedRefresh(profiles)) {
		await fetchProfiles(uuid);

		return await getStoredProfiles(uuid);
	}

	return profiles;
}

export async function getProfileMember(player: string, profileId: string) {
	const uuid = await getUUID(player);

	if (!uuid) {
		throw new Error('Player not found!');
	}

	if (isUUID(profileId)) {
		const member = await getStoredProfileMember(uuid, profileId);

		if (memberNeedsRefresh(member)) {
			await fetchProfiles(uuid);
		}

		return await getStoredProfileMember(uuid, profileId);
	}

	const profiles = await getProfiles(uuid);
	if (!profiles) {
		return null;
	}

	const profile = profiles.find((p) => p.cuteName.toUpperCase() === profileId.toUpperCase());

	return await getProfileMemberFromUuids(uuid, profile?.id ?? profileId);
}

async function getProfileMemberFromUuids(uuid: string, profileUuid: string) {
	const member = await getStoredProfileMember(uuid, profileUuid);

	if (memberNeedsRefresh(member)) {
		await fetchProfiles(uuid);
	}

	return member;
}

export async function fetchProfiles(uuid: string) {
	const response = await hypixelRequest<{ success: boolean; cause?: string; profiles?: SkyBlockProfile[] }>({
		endpoint: 'skyblock/profiles',
		query: { uuid },
		usesApiKey: true
	});

	if (!response?.success) {
		throw new Error(response?.cause ?? 'Request to Hypixel API failed. Please try again!');
	}

	const { profiles } = response;

	if (!profiles || profiles.length === 0) {
		throw new Error('Player has no profiles!');
	}

	return await parseProfilesResponse(uuid, profiles);
}

function profilesNeedRefresh(profiles?: StoredProfile[]) {
	if (!profiles?.length || dev) return true;

	return profiles
		.filter((p) => p.members.some((m) => !m.removed))
		.some((p) => outOfDateSeconds(p.lastUpdated, profileCacheTTL));
}

function memberNeedsRefresh(member?: StoredProfileMember | null) {
	if (!member?.lastUpdated || dev) return true;

	return outOfDateSeconds(member.lastUpdated, profileCacheTTL);
}

function outOfDateSeconds(lastUpdated: number, ttl: number) {
	return lastUpdated + ttl < Math.floor(Date.now() / 1000);
}
