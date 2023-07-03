<script lang="ts">
	import Head from '$comp/head.svelte';
	import PlayerRender from '$comp/playerRender.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Head
	title="{data.player.username} | Skyblock Stats"
	description="Very cool stats"
	imageUrl="https://mc-heads.net/avatar/{data.player.username}"
/>

<h1>{data.player.username} | {data.profile.profile_name}</h1>
<p>Skyblock Level - {data.profile.skyblock_level}</p>
<PlayerRender uuid={data.player.uuid} />
