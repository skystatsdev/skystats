import * as constants from '$constants';
import { HYPIXEL_API_KEY } from '$env/static/private';
import { MONGO } from '$mongo/mongo';
import { isUUID } from '$params/uuid';
import type {
	HypixelRequestOptions,
	SkyblockProfile,
	SkyblockProfileMember,
	StoredHypixelPlayer,
	StoredSkyblockProfile
} from '$types';
import { getUUID } from '../mojang';
import { getLevelByXp, getXpByLevel } from './skills/leveling';

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

async function getLevels(
	userProfile: SkyblockProfileMember,
	profileMembers: SkyblockProfile['members'],
	hypixelProfile: Record<any, any>,
	levelCaps: Record<any, any>
) {
	const skillLevels: Record<string, any> = {};
	if (userProfile.player_data && 'experience' in userProfile.player_data) {
		const SKILL = userProfile.player_data.experience;

		const socialExperience = Object.keys(profileMembers).reduce((a, b) => {
			return a + (profileMembers[b].player_data?.experience?.SKILL_SOCIAL || 0);
		}, 0);

		Object.assign(skillLevels, {
			taming: getLevelByXp(SKILL.SKILL_TAMING || 0, { skill: 'taming' }),
			farming: getLevelByXp(SKILL.SKILL_FARMING || 0, { skill: 'farming', cap: levelCaps.farming }),
			mining: getLevelByXp(SKILL.SKILL_MINING || 0, { skill: 'mining' }),
			combat: getLevelByXp(SKILL.SKILL_COMBAT || 0, { skill: 'combat' }),
			foraging: getLevelByXp(SKILL.SKILL_FORAGING || 0, { skill: 'foraging' }),
			fishing: getLevelByXp(SKILL.SKILL_FISHING || 0, { skill: 'fishing' }),
			enchanting: getLevelByXp(SKILL.SKILL_ENCHANTING || 0, { skill: 'enchanting' }),
			alchemy: getLevelByXp(SKILL.SKILL_ALCHEMY || 0, { skill: 'alchemy' }),
			carpentry: getLevelByXp(SKILL.SKILL_CARPENTRY || 0, { skill: 'carpentry' }),
			runecrafting: getLevelByXp(SKILL.SKILL_RUNECRAFTING || 0, { skill: 'runecrafting', cap: levelCaps.runecrafting }),
			social: getLevelByXp(socialExperience, { skill: 'social' })
		});
	} else {
		const achievementSkills: Record<string, any> = {
			farming: hypixelProfile.achievements.skyblock_harvester || 0,
			mining: hypixelProfile.achievements.skyblock_excavator || 0,
			combat: hypixelProfile.achievements.skyblock_combat || 0,
			foraging: hypixelProfile.achievements.skyblock_gatherer || 0,
			fishing: hypixelProfile.achievements.skyblock_angler || 0,
			enchanting: hypixelProfile.achievements.skyblock_augmentation || 0,
			alchemy: hypixelProfile.achievements.skyblock_concoctor || 0,
			taming: hypixelProfile.achievements.skyblock_domesticator || 0,
			carpentry: 0
		};

		for (const skill in achievementSkills) {
			skillLevels[skill] = getXpByLevel(achievementSkills[skill], { skill });
		}
	}

	const totalSkillXp = Object.keys(skillLevels)
		.filter((skill) => !constants.SKYBLOCK_COSMETIC_SKILLS.includes(skill))
		.reduce((total, skill) => total + skillLevels[skill].xp || 0, 0);

	const nonCosmeticSkills = Math.max(Object.keys(skillLevels).length - constants.SKYBLOCK_COSMETIC_SKILLS.length, 9);

	const averageSkillLevel =
		Object.keys(skillLevels)
			.filter((skill) => !constants.SKYBLOCK_COSMETIC_SKILLS.includes(skill))
			.reduce((total, skill) => total + (skillLevels[skill].level || 0) + (skillLevels[skill].progress || 0), 0) /
		nonCosmeticSkills;

	const averageSkillLevelWithoutProgress =
		Object.keys(skillLevels)
			.filter((skill) => !constants.SKYBLOCK_COSMETIC_SKILLS.includes(skill))
			.reduce((total, skill) => total + (skillLevels[skill].level || 0), 0) / nonCosmeticSkills;

	for (const skill in skillLevels) {
		skillLevels[skill].rank = 0;
	}

	return {
		skills: skillLevels,
		averageSkillLevel,
		averageSkillLevelWithoutProgress,
		totalSkillXp
	};
}

export async function getSkills(
	userProfile: SkyblockProfileMember,
	hypixelProfile: Record<any, any>,
	profileMembers: SkyblockProfile['members']
) {
	const levelCaps = {
		farming:
			constants.SKYBLOCK_DEFAULT_SKILL_CAPS.farming + (userProfile.jacobs_contest?.perks?.farming_level_cap ?? 0),
		carpentry: hypixelProfile.rankText
			? constants.SKYBLOCK_DEFAULT_SKILL_CAPS.runecrafting
			: constants.SKYBLOCK_NON_RUNECRAFTING_LEVEL_CAP
	};

	return await getLevels(userProfile, profileMembers, hypixelProfile, levelCaps);
}
