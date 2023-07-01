<script lang="ts">
	import Head from '$comp/head.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Head title="{data.player.username} | Skyblock Stats" description="Very cool stats" />

<h1>{data.player.username} | {data.profile.profile_name}</h1>
<p>Skyblock Level - {data.profile.skyblock_level}</p>
<img src="https://mc-heads.net/body/{data.player.uuid}" alt="Minecraft Skin" />
