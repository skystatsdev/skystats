<script lang="ts">
	import Head from '$comp/head.svelte';
	import PlayerRender from '$comp/playerRender.svelte';
	import Header from '$comp/header.svelte';
	import { HYPIXEL_RANK_COLORS } from '$constants';
	import type { SkyblockProfile } from '$types';
	import Popover from '$comp/basic stats/Popover.svelte';
	import PopoverItem from '$comp/basic stats/PopoverItem.svelte';

	export let data: SkyblockProfile;

	data.profile.members = data.profile.members
		.filter((member) => member.username !== data.player.username)
		.sort((a, b) => a.username.localeCompare(b.username));
	data.player.skyblock.profiles = data.player.skyblock.profiles
		.filter((profile) => profile.name !== data.profile_name)
		.sort((a, b) => a.name.localeCompare(b.name));

	let { name: rankName, plus_color: rankPlus, formatted: rankFormatted } = data.player.rank;
	let rankRegex = /(§[a-f0-9])/g;
	rankFormatted = rankFormatted.replace(/[^a-zA-Z0-9\][+§]/g, '');
	let rankColor = rankRegex.exec(rankFormatted)![0] as keyof typeof HYPIXEL_RANK_COLORS;
	if (rankPlus) {
		rankPlus = rankRegex.exec(rankFormatted)![1] as keyof typeof HYPIXEL_RANK_COLORS;
	}
</script>

<Head
	title="{data.player.username} | Skyblock Stats"
	description="Very cool stats"
	imageUrl="https://mc-heads.net/avatar/{data.player.username}"
/>

<Header />

<!-- <p>Skyblock Level - {data.skyblock_level}</p> -->
<PlayerRender uuid={data.player.uuid} />
<div
	class="relative ml-[30vw] backdrop-blur-lg backdrop-brightness-50 p-[30px] pt-[calc(48px)] pb-[30px] min-h-screen box-border select-none"
>
	<div class="text-[36px] mt-[50px] mb-[20px] flex flex-wrap gap-x-[10px] gap-y-[8px] items-center">
		<span>Stats for</span>
		<Popover id="stats-for-player">
			<div slot="display-content">
				{#if rankName !== 'NONE'}
					<div
						class="inline-flex text-[18px] h-[34px] leading-[34px] mt-[10px] ml-[-5px] rounded-[100px] align-top font-[700px] overflow-clip"
					>
						<div class="{HYPIXEL_RANK_COLORS[rankColor]} px-[15px] inline-block">
							{data.player.rank.name?.replaceAll('+', '')}
						</div>
						{#if rankPlus !== undefined}
							<div
								class="{HYPIXEL_RANK_COLORS[
									rankPlus
								]} pr-[8px] relative z-[1px] inline-block before:content-[''] before:z-[-1px] before:absolute before:top-0 before:bottom-0 before:left-[-7px] before:right-0 before:skew-y-[-20deg] before:skew-x-[-20deg]"
							>
								<!-- <div class=""/> -->
								{data.player.rank.name?.replace(/[A-z]/g, '')}
							</div>
						{/if}
					</div>
				{/if}
				{data.player.username}
			</div>
			<div slot="popover-content">
				{#each data.profile.members as member, memberIndex}
					<PopoverItem href="/@{member.username}" index={memberIndex} totalItems={data.profile.members.length}
						>{member.username}</PopoverItem
					>
				{/each}
			</div>
		</Popover>
		<span>on</span>
		<Popover id="stats-for-profile">
			<div slot="display-content">{data.profile_name}</div>
			<div slot="popover-content">
				{#each data.player.skyblock.profiles as profile, profileIndex}
					<PopoverItem
						href="/@{data.player.username}/{profile.name}"
						index={profileIndex}
						totalItems={data.player.skyblock.profiles.length}>{profile.name}</PopoverItem
					>
				{/each}
			</div>
		</Popover>
	</div>
</div>
