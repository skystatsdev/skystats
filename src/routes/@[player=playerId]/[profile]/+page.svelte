<script lang="ts">
	import Head from '$comp/head.svelte';
	import PlayerRender from '$comp/playerRender.svelte';
	import Header from '$comp/header.svelte';
	import PlayerProfile from '$comp/PlayerProfile/PlayerProfile.svelte';
	import BasicStats from '$comp/BasicStats/BasicStats.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ign = data.account.name;
</script>

<Head title="{ign} | Skyblock Stats" description="Very cool stats" imageUrl="https://mc-heads.net/avatar/{ign}" />

<Header />

<PlayerRender username={ign} />
<div
	class="relative ml-[30vw] backdrop-blur-lg backdrop-brightness-50 p-[30px] pt-[calc(48px)] pb-[30px] min-h-[1500px] box-border select-none overflow-x-hidden"
>
	<PlayerProfile
		rankData={data.player.data?.rank}
		account={data.account}
		playerProfiles={data.profiles}
		cuteName={data.profile.cuteName}
	/>
	<BasicStats skillData={data.member?.stats.skills} />
</div>
