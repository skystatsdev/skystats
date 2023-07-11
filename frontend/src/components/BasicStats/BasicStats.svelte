<script lang="ts">
	import SkillComponent from '$comp/SkillComponent/skillComponent.svelte';
	import type { SkyblockSkillData, SkyblockSkillName } from '$types';

	export let skillData: Record<SkyblockSkillName, SkyblockSkillData>;
</script>

<div class="grid gap-[24px] p-[30px] mx-[calc(-1*30px)] bg-[rgba(0,0,0,0.3)]">
	<div class="">
		<div class="grid gap-x-[24px] gap-y-[4px] grid-cols-[1fr_1fr]">
			<SkillComponent skillData={skillData.taming} skillName="Taming" />
			<SkillComponent skillData={skillData.farming} skillName="Farming" />
			<SkillComponent skillData={skillData.mining} skillName="Mining" />
			<SkillComponent skillData={skillData.combat} skillName="Combat" />
			<SkillComponent skillData={skillData.foraging} skillName="Foraging" />
			<SkillComponent skillData={skillData.fishing} skillName="Fishing" />
			<SkillComponent skillData={skillData.enchanting} skillName="Enchanting" />
			<SkillComponent skillData={skillData.alchemy} skillName="Alchemy" />
			<SkillComponent skillData={skillData.carpentry} skillName="Carpentry" />
			<SkillComponent skillData={skillData.runecrafting} skillName="Runecrafting" />
			<SkillComponent skillData={skillData.social} skillName="Social" />
		</div>
	</div>
</div>
