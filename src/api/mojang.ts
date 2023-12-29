import { isUsername } from '$params/ign';
import { isUUID } from '$params/uuid';
import { REDIS } from '$redis/redis';

//! TEMPORARY CACHE TIMES (we want to cache transformed data later also, not raw data)
const accountCacheTTL = 600; // 10 minutes

export async function fetchMinecraftAccount(user: string) {
	if (isUsername(user)) {
		return await fetchMinecraftAccountByUsername(user);
	}

	if (isUUID(user)) {
		return await fetchMinecraftAccountByUuid(user);
	}

	return null;
}

export async function fetchExistingMinecraftAccount(user: string) {
	let uuid;

	if (isUsername(user)) {
		uuid = await getUUID(user, false);
	} else if (isUUID(user)) {
		uuid = user;
	} else {
		return null;
	}

	if (await REDIS.EXISTS(`mojang:account:${uuid}`)) {
		const data = await REDIS.GET(`mojang:account:${uuid}`);

		if (data) {
			return JSON.parse(data) as MinecraftAccountResponse;
		}
	}

	return null;
}

export async function fetchMinecraftAccountByUuid(uuid: string) {
	uuid = uuid.replaceAll('-', '');

	const existing = await fetchExistingMinecraftAccount(uuid);
	if (existing) {
		return existing;
	}

	const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

	try {
		const data = (await response.json()) as MinecraftAccountResponse | MinecraftAccountErrorReponse;

		if ('success' in data) {
			return null;
		}

		REDIS.SETEX(`mojang:account:${data.id}`, accountCacheTTL, JSON.stringify(data));
		REDIS.SETEX(`username:${data.id}`, accountCacheTTL, data.name);
		REDIS.SETEX(`uuid:${data.name}`, accountCacheTTL, data.id);

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function fetchMinecraftAccountByUsername(username: string) {
	const existing = await fetchExistingMinecraftAccount(username);
	if (existing) {
		return existing;
	}

	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);

	try {
		const data = (await response.json()) as MinecraftProfilesResponse | MinecraftAccountErrorReponse;

		if ('success' in data) {
			return null;
		}

		return await fetchMinecraftAccountByUuid(data.id);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getUsername(uuid: string, fetch = true): Promise<string | null> {
	uuid = uuid.replaceAll('-', '');

	const name = await REDIS.GET(`username:${uuid}`);

	if (name || !fetch) {
		return name;
	}

	const data = await fetchMinecraftAccountByUuid(uuid);

	if (data) {
		REDIS.SETEX(`username:${uuid}`, accountCacheTTL, data.name);
		return data.name;
	}

	return null;
}

export async function getUUID(username: string, fetch = true): Promise<string | null> {
	const uuid = await REDIS.GET(`uuid:${username}`);

	if (uuid || !fetch) {
		return uuid;
	}

	const data = await fetchMinecraftAccountByUsername(username);

	if (data) {
		REDIS.SETEX(`uuid:${username}`, accountCacheTTL, data.id);
		return data.id;
	}

	return null;
}

export interface MinecraftProfilesResponse {
	id: string;
	name: string;
}

export interface MinecraftAccountResponse extends MinecraftProfilesResponse {
	properties: MinecraftAccountProperty[];
}

export interface MinecraftAccountProperty {
	name: string;
	value: string;
	signature?: string;
}

export interface MinecraftAccountErrorReponse {
	success: false;
	cause: string;
}
