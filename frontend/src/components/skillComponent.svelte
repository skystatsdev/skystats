<script lang="ts">
	import type { SkillObject } from './../lib/skyblock.d.ts';
	export let skillData: SkillObject;
	export let skillName: string;
</script>

{#if skillData && skillName}
	<div class="skill">
		<div class="skill-name">
			{skillName}
			<span class="skill-level">{skillData.level >= 0 ? skillData.level : '?'}</span>
		</div>
		<div class="skill-bar" data-skill={skillName}>
			<div
				class="skill-progress-bar {skillData.level == skillData.max_level ? 'maxed' : ''}   "
				style="--progress: {skillData.level == skillData.level_cap ? 100 : skillData.progress * 100}%;"
			/>
			<div class="skill-progress-text">
				{skillData.xp.toLocaleString()}
			</div>
		</div>
	</div>
{/if}

<style>
	.skill {
		margin-left: 10px;
	}

	.skill-bar {
		width: 100%;
		height: 20px;
		background-color: #282828;
		border-radius: 10px;
	}

	.skill-progress-bar {
		width: var(--progress);
		height: 100%;
		background-color: #b7410e;
		border-radius: 10px;
		transition: width 0.5s ease-in-out;
	}

	.skill-progress-bar.maxed {
		background-color: #0e7bb7;
	}

	.skill-progress-text {
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		margin-top: -21px;
	}
</style>
