<script lang="ts">
	import HomePageCard from '$comp/homePageCard.svelte';
	import { goto } from '$app/navigation';

	export const USERS = [
		{
			username: 'tonydawhale',
			description: 'Epic swag awesome gamer'
		}
	];
	$: user = USERS;

	let search: string;

	function gotoPlayer() {
		if (!search) return;
		goto(`/@${search}`);
	}
</script>

<div
	class="select-none grid box-border min-h-[calc(100vh-48px)] grid-cols-[350px_350px_350px] justify-items-stretch place-content-center gap-[20px] mt-[48px] p-[20px]"
>
	<div
		class="grid col-[1/-1] justify-items-center gap-[25px] py-[25px] text-[30px] rounded-[10px] backdrop-blur-lg backdrop-brightness-50"
	>
		<p class="block w-[100%] text-center font-semibold">Show Skyblock stats for</p>
		<form class="w-full" on:submit|preventDefault={gotoPlayer}>
			<input
				bind:value={search}
				aria-label="username"
				required
				placeholder="Enter a username"
				class="relative w-[100%] h-[2.25em] text-[30px] text-center box-border bg-white/10 border-0 text-white"
			/>
		</form>
		<a
			href="/@{search}"
			class="flex h-[48px] rounded-3xl px-[24px] items-center border-0 appearance-none bg-[#C24100] uppercase text-[16px] text-white font-bold [text-shadow:0_0_3px_rgba(0,0,0,.5)] hover:scale-[1.02] duration-150 ease-in-out"
			>Submit</a
		>
	</div>
	<a
		href="/discord"
		target="_blank"
		rel="noreferrer"
		class="relative col-[1/-1] backdrop-blur-lg backdrop-brightness-50 rounded-[10px] hover:scale-[1.02] duration-150 ease-in-out"
	>
		Data Goes Here
	</a>
	{#each user as user}
		<HomePageCard username={user.username} description={user.description} />
	{/each}
</div>
