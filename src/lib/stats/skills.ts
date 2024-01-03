import { getLevelByXp, getXpByLevel } from '$stats/skills/leveling';
import * as constants from '$constants';
import type {
	SkyBlockProfileMember,
	SkyBlockProfile,
	HypixelPlayerData,
	SkyBlockStatsLevelCaps,
	SkyBlockStatsSkillName,
	SkyBlockStatsSkillData,
	SkyBlockStatsSkills
} from '$types/hypixel';

function getLevels(
	userProfile: Partial<SkyBlockProfileMember>,
	profileMembers: SkyBlockProfile['members'],
	hypixelProfile: HypixelPlayerData,
	levelCaps: SkyBlockStatsLevelCaps
): SkyBlockStatsSkills {
	const skillLevels: Partial<Record<SkyBlockStatsSkillName, SkyBlockStatsSkillData>> = {};
	if (userProfile.player_data && 'experience' in userProfile.player_data) {
		const skills = userProfile.player_data.experience;

		const socialExperience = Object.keys(profileMembers).reduce((a, b) => {
			return a + (profileMembers[b].player_data?.experience?.SKILL_SOCIAL || 0);
		}, 0);
		Object.assign(skillLevels, {
			taming: getLevelByXp(skills.SKILL_TAMING || 0, { skill: 'taming' }),
			farming: getLevelByXp(skills.SKILL_FARMING || 0, { skill: 'farming', cap: levelCaps.farming }),
			mining: getLevelByXp(skills.SKILL_MINING || 0, { skill: 'mining' }),
			combat: getLevelByXp(skills.SKILL_COMBAT || 0, { skill: 'combat' }),
			foraging: getLevelByXp(skills.SKILL_FORAGING || 0, { skill: 'foraging' }),
			fishing: getLevelByXp(skills.SKILL_FISHING || 0, { skill: 'fishing' }),
			enchanting: getLevelByXp(skills.SKILL_ENCHANTING || 0, { skill: 'enchanting' }),
			alchemy: getLevelByXp(skills.SKILL_ALCHEMY || 0, { skill: 'alchemy' }),
			carpentry: getLevelByXp(skills.SKILL_CARPENTRY || 0, { skill: 'carpentry' }),
			runecrafting: getLevelByXp(skills.SKILL_RUNECRAFTING || 0, { type: 'runecrafting', cap: levelCaps.runecrafting }),
			social: getLevelByXp(socialExperience, { type: 'social' })
		});
	} else {
		const achievementSkills: Record<SkyBlockStatsSkillName, number> = {
			farming: hypixelProfile.achievements.skyblock_harvester || 0,
			mining: hypixelProfile.achievements.skyblock_excavator || 0,
			combat: hypixelProfile.achievements.skyblock_combat || 0,
			foraging: hypixelProfile.achievements.skyblock_gatherer || 0,
			fishing: hypixelProfile.achievements.skyblock_angler || 0,
			enchanting: hypixelProfile.achievements.skyblock_augmentation || 0,
			alchemy: hypixelProfile.achievements.skyblock_concoctor || 0,
			taming: hypixelProfile.achievements.skyblock_domesticator || 0,
			carpentry: 0,
			runecrafting: 0,
			social: 0
		};

		for (const skill in achievementSkills) {
			skillLevels[skill as SkyBlockStatsSkillName] = getXpByLevel(
				achievementSkills[skill as SkyBlockStatsSkillName] as number,
				{ skill }
			);
		}
	}

	const getNonCosmeticSkills = (skillLevels: Record<string, SkyBlockStatsSkillData>) => {
		return (Object.keys(skillLevels) as SkyBlockStatsSkillName[]).filter(
			(skill) => !constants.SKYBLOCK_COSMETIC_SKILLS.includes(skill)
		);
	};

	const nonCosmeticSkills: SkyBlockStatsSkillName[] = getNonCosmeticSkills(skillLevels);
	const nonCosmeticSkillsCount = Math.max(nonCosmeticSkills.length, 9);

	const totalSkillXp = nonCosmeticSkills.reduce((total, skill) => total + (skillLevels[skill]?.xp || 0), 0);

	const averageSkillLevel =
		nonCosmeticSkills.reduce(
			(total, skill) => total + (skillLevels[skill]?.level || 0) + (skillLevels[skill]?.progress || 0),
			0
		) / nonCosmeticSkillsCount;

	const averageSkillLevelWithoutProgress =
		nonCosmeticSkills.reduce((total, skill) => total + (skillLevels[skill]?.level || 0), 0) / nonCosmeticSkillsCount;

	// TODO: Implement this once leaaderboards are implemented
	// for (const skill in skillLevels) {
	//	 skillLevels[skill as SkyBlockStatsSkillName].rank = 0;
	// }

	return {
		skills: skillLevels as Record<SkyBlockStatsSkillName, SkyBlockStatsSkillData>,
		averageSkillLevel,
		averageSkillLevelWithoutProgress,
		totalSkillXp
	};
}

export function getSkills(
	userProfile: Partial<SkyBlockProfileMember>,
	hypixelProfile: HypixelPlayerData,
	profileMembers: SkyBlockProfile['members']
) {
	const levelCaps = {
		farming:
			constants.SKYBLOCK_DEFAULT_SKILL_CAPS.farming + (userProfile.jacobs_contest?.perks?.farming_level_cap ?? 0),
		runecrafting: hypixelProfile.rank
			? constants.SKYBLOCK_DEFAULT_SKILL_CAPS.runecrafting
			: constants.SKYBLOCK_NON_RUNECRAFTING_LEVEL_CAP
	};
	return getLevels(userProfile, profileMembers, hypixelProfile, levelCaps);
}
