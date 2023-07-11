<script lang="ts">
	import type { SkillObject } from '$lib/skyblock.js';
	export let skillData: SkillObject;
	export let skillName: string;

	$: maxed = skillData.level === skillData.max_level;

	$: skillBarColor = maxed ? 'bg-[#dd980e]' : 'bg-[#C24100]';
</script>

<!-- min-[481px]:w-[200%] -->
<div class="relative h-[36px]">
	<div
		class="overflow-clip w-[36px] h-[36px] rounded-[50%] {skillBarColor} relative z-[10] drop-shadow-[2px_2px_2px_rgba(0,0,0,0.4)]"
	>
		<div
			class="bg-[128px_auto_url(https://sky.shiiyu.moe/head/2e2cc42015e6678f8fd49ccc01fbf787f1ba2c32bcf559a015332fc5db50)] bg-no-repeat bg-[center_center]"
		/>
		{#if maxed}
			<div
				class="absolute top-0 left-0 bottom-0 right-0 before:content-[''] before:absolute before:top-0 before:left-0 before:bottom-0 before:right-0 before:[transform:translateY(-100%)] z-[8] bg-[linear-gradient(to_top,rgba(255,255,255,0)_0%,rgba(255,255,255,0.5)_50%,rgba(128,186,232,0)_99%,rgba(125,185,232,0)_100%)] animate-[shine_4s_infinite]"
			/>
		{/if}
	</div>
	<div class="absolute left-[40px] top-0 font-[600] text-[14px] h-[22px] leading-[22px]">
		{skillName}
		<span class="text-[rgba(255,255,255,0.8)]">
			{skillData.level}
		</span>
	</div>
	<div class="absolute bottom-0 left-[18px] pl-[18px] right-0 h-[14px] rounded-r-[7px] bg-[rgba(255,255,255,0.3)]">
		<div
			style="--progress:{skillData.progress}"
			class="w-[calc((100%)*var(--progress))] absolute pl-[18px] left-0 top-0 bottom-0 {skillBarColor} rounded-r-[7px]"
		/>
		<div
			class="absolute left-[18px] top-0 bottom-0 right-0 text-center font-[600] text-[12px] leading-[14px] [text-shadow:0_0_3px_rgba(0,0,0,.5)]"
		>
			{Intl.NumberFormat('en', { notation: 'compact' }).format(skillData.xp_current)}
			{#if !maxed}/ {Intl.NumberFormat('en', { notation: 'compact' }).format(skillData.xp_for_next)}{/if}
		</div>
	</div>
</div>
