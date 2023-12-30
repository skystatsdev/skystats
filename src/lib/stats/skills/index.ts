import * as constants from '$constants';
import type { SkyblockProfile, SkyblockProfileMember } from '$types';
import { getLevelByXp, getXpByLevel } from './leveling';

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
