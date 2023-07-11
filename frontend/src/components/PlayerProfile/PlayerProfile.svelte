<script lang="ts">
	import type { PlayerHypixelRankData, PlayerSkyblockProfileData, ProfileMemberData } from '$types';

	import { HYPIXEL_RANK_COLORS } from '$constants';

	import Popover from '$comp/PlayerProfile/Popover.svelte';
	import PopoverItem from '$comp/PlayerProfile/PopoverItem.svelte';

	export let rankData: PlayerHypixelRankData;
	export let username: string;
	export let playerProfiles: PlayerSkyblockProfileData[];
	export let profileName: string;
	export let profileMembers: ProfileMemberData[];

	$: profileMembers = profileMembers
		.filter((member) => member.username !== username)
		.sort((a, b) => a.username.localeCompare(b.username));

	$: playerProfiles = playerProfiles
		.filter((profile) => profile.name !== profileName)
		.sort((a, b) => a.name.localeCompare(b.name));

	let rankRegex = /(§[a-f0-9])/g;
	$: rankName = rankData?.name;
	$: rankFormatted = rankData?.formatted.replace(/[^a-zA-Z0-9\][+§]/g, '');
	$: rankColor = HYPIXEL_RANK_COLORS[rankFormatted.match(rankRegex)![0] as keyof typeof HYPIXEL_RANK_COLORS];
	$: rankPlus = rankData.plus_color
		? HYPIXEL_RANK_COLORS[rankRegex.exec(rankFormatted)![1] as keyof typeof HYPIXEL_RANK_COLORS]
		: undefined;
</script>

<div class="text-[36px] mt-[50px] mb-[20px] flex flex-wrap gap-x-[10px] gap-y-[8px] items-center">
	<span>Stats for</span>
	<Popover id="stats-for-player">
		<div slot="display-content">
			{#if rankName !== 'NONE'}
				<div
					class="inline-flex text-[18px] h-[34px] leading-[34px] mt-[10px] ml-[-5px] rounded-[100px] align-top font-[700px] overflow-clip"
				>
					<div class="{rankColor} px-[15px] inline-block">
						{rankName?.replaceAll('+', '')}
					</div>
					{#if rankPlus !== undefined}
						<div
							class="{rankPlus ||
								''} pr-[8px] relative z-[1px] inline-block before:content-[''] before:z-[-1px] before:absolute before:top-0 before:bottom-0 before:left-[-7px] before:right-0 before:skew-y-[-20deg] before:skew-x-[-20deg]"
						>
							{rankName?.replace(/[A-z]/g, '')}
						</div>
					{/if}
				</div>
			{/if}
			{username}
		</div>
		<div slot="popover-content">
			{#each profileMembers as member, memberIndex}
				<PopoverItem href="/@{member.username}" index={memberIndex} totalItems={profileMembers.length}
					>{member.username}</PopoverItem
				>
			{/each}
		</div>
	</Popover>
	<span>on</span>
	<Popover id="stats-for-profile">
		<div slot="display-content">{profileName}</div>
		<div slot="popover-content">
			{#each playerProfiles as profile, profileIndex}
				<PopoverItem href="/@{username}/{profile.name}" index={profileIndex} totalItems={playerProfiles.length}
					>{profile.name}</PopoverItem
				>
			{/each}
		</div>
	</Popover>
	<div class="text-[15px] relative w-full">Extra Stats Here</div>
</div>
