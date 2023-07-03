<script lang="ts">
	import Head from '$comp/head.svelte';
	import PlayerRender from '$comp/playerRender.svelte';
	import Header from '$comp/header.svelte';
	import SkillComponent from '$comp/skillComponent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Head
	title="{data.player.username} | Skyblock Stats"
	description="Very cool stats"
	imageUrl="https://mc-heads.net/avatar/{data.player.username}"
/>

<Header />

<p>Skyblock Level - {data.profile.skyblock_level}</p>
<PlayerRender uuid={data.player.uuid} />
<img src="https://mc-heads.net/body/{data.player.uuid}" alt="Minecraft Skin" />
<h1>{data.player.username} | {data.profile.profile_name}</h1>

<h1>SkyBlock Level: {data.profile.skyblock_level}</h1>
<h1>Fairy Souls: {data.profile.fairy_souls}</h1>
<br />

<div class="skills">
	{#each Object.keys(data.profile.skills) as skill}
		<SkillComponent skillData={data.profile.skills[skill]} skillName={skill} />
	{/each}
</div>

<style>
	.skills {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 10px;
		max-width: 50%;
	}
</style>
