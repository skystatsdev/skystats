import { IsIGN } from '$params/ign';
import { IsUUID } from '$params/uuid';
import { redis } from '$redis/connection';

//! TEMPORARY CACHE TIMES (we want to cache transformed data later also, not raw data)
const ACCOUNT_CACHE_TTL = 600; // 10 minutes

export async function FetchMinecraftAccount(user: string) {
	if (IsIGN(user)) {
		return await FetchMinecraftAccountByUsername(user);
	}

	if (IsUUID(user)) {
		return await FetchMinecraftAccountByUuid(user);
	}

	return null;
}

export async function FetchExistingMinecraftAccount(user: string) {
	let uuid;

	if (IsIGN(user)) {
		uuid = await FetchUuid(user, false);
	} else if (IsUUID(user)) {
		uuid = user;
	} else {
		return null;
	}

	if (await redis.EXISTS(`mojang:account:${uuid}`)) {
		const data = await redis.GET(`mojang:account:${uuid}`);

		if (data) {
			return JSON.parse(data) as MinecraftAccountResponse;
		}
	}

	return null;
}

export async function FetchMinecraftAccountByUuid(uuid: string) {
	uuid = uuid.replaceAll('-', '');

	const existing = await FetchExistingMinecraftAccount(uuid);
	if (existing) {
		return existing;
	}

	const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

	try {
		const data = (await response.json()) as MinecraftAccountResponse | MinecraftAccountErrorReponse;

		if ('success' in data) {
			return null;
		}

		redis.SETEX(`mojang:account:${data.id}`, ACCOUNT_CACHE_TTL, JSON.stringify(data));
		redis.SETEX(`username:${data.id}`, ACCOUNT_CACHE_TTL, data.name);
		redis.SETEX(`uuid:${data.name}`, ACCOUNT_CACHE_TTL, data.id);

		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function FetchMinecraftAccountByUsername(username: string) {
	const existing = await FetchExistingMinecraftAccount(username);
	if (existing) {
		return existing;
	}

	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);

	try {
		const data = (await response.json()) as MinecraftProfilesResponse | MinecraftAccountErrorReponse;

		if ('success' in data) {
			return null;
		}

		return await FetchMinecraftAccountByUuid(data.id);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function FetchUsername(uuid: string, fetch = true): Promise<string | null> {
	uuid = uuid.replaceAll('-', '');

	const name = await redis.GET(`username:${uuid}`);

	if (name || !fetch) {
		return name;
	}

	const data = await FetchMinecraftAccountByUuid(uuid);

	if (data) {
		redis.SETEX(`username:${uuid}`, ACCOUNT_CACHE_TTL, data.name);
		return data.name;
	}

	return null;
}

export async function FetchUuid(username: string, fetch = true): Promise<string | null> {
	const uuid = await redis.GET(`uuid:${username}`);

	if (uuid || !fetch) {
		return uuid;
	}

	const data = await FetchMinecraftAccountByUsername(username);

	if (data) {
		redis.SETEX(`uuid:${username}`, ACCOUNT_CACHE_TTL, data.id);
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
