<script lang="ts">
	import Head from '$comp/head.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Head title="{data.ign} | Skyblock Stats" description="Very cool stats" />

<h1>{data.ign} | {data.profileName}</h1>
<p>Skyblock Level - {data.profile.member.leveling.experience / 100}</p>
<img src="https://mc-heads.net/body/{data.account.id}" alt="Minecraft Skin" />
