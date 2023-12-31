<script lang="ts">
	import SkillComponent from '$comp/SkillComponent/SkillComponent.svelte';
	import type { SkyblockPlayerSkillStats } from '$types/hypixel';

	export let skillData: SkyblockPlayerSkillStats | undefined;

	$: skills = skillData?.skills;
</script>

<div class="grid gap-[24px] p-[30px] mx-[calc(-1*30px)] bg-[rgba(0,0,0,0.3)]">
	{#if skills}
		<div class="">
			<div class="grid gap-x-[24px] gap-y-[4px] grid-cols-[1fr_1fr]">
				<SkillComponent skillData={skills.taming} skillName="Taming" />
				<SkillComponent skillData={skills.farming} skillName="Farming" />
				<SkillComponent skillData={skills.mining} skillName="Mining" />
				<SkillComponent skillData={skills.combat} skillName="Combat" />
				<SkillComponent skillData={skills.foraging} skillName="Foraging" />
				<SkillComponent skillData={skills.fishing} skillName="Fishing" />
				<SkillComponent skillData={skills.enchanting} skillName="Enchanting" />
				<SkillComponent skillData={skills.alchemy} skillName="Alchemy" />
				<SkillComponent skillData={skills.carpentry} skillName="Carpentry" />
				<SkillComponent skillData={skills.runecrafting} skillName="Runecrafting" />
				<SkillComponent skillData={skills.social} skillName="Social" />
			</div>
		</div>
	{:else}
		<div>Skills API disabled!</div>
	{/if}
</div>
