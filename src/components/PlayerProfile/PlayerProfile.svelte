<script lang="ts">
	import type { PlayerSkyblockProfileData } from '$types/hypixel';
	import { RANKS, RANK_PLUS_COLORS, type RankInformation } from '$constants';

	import Popover from '$comp/PlayerProfile/Popover.svelte';
	import PopoverItem from '$comp/PlayerProfile/PopoverItem.svelte';
	import type { MinecraftAccountResponse } from '$api/mojang';

	export let rankData: RankInformation | undefined;
	export let account: MinecraftAccountResponse;
	export let playerProfiles: PlayerSkyblockProfileData[];
	export let cuteName: string;

	$: selectedProfile = playerProfiles.find((profile) => profile.selected);

	$: profileMembers =
		selectedProfile?.members
			.filter((member) => member.uuid !== account.id)
			.sort((a, b) => b.ign.localeCompare(a.ign)) ?? [];

	$: profiles = playerProfiles
		.filter((profile) => profile.id !== selectedProfile?.id)
		.sort((a, b) => b.cuteName.localeCompare(a.cuteName));

	$: rankColor = Object.values(RANKS).find((rank) => rank.color === rankData?.color)?.color;
	$: rankPlus = Object.values(RANK_PLUS_COLORS).find((color) => color === rankData?.plusColor);
</script>

<div class="text-[36px] mt-[50px] mb-[20px] flex flex-wrap gap-x-[10px] gap-y-[8px] items-center">
	<span>Stats for</span>
	<Popover id="stats-for-player">
		<div slot="display-content">
			{#if rankData}
				<div
					class="inline-flex text-[18px] h-[34px] leading-[34px] mt-[10px] ml-[-5px] rounded-[100px] align-top font-[700] overflow-clip"
				>
					<div class="bg-[{rankColor}] px-[15px] inline-block">
						{rankData.tag}
					</div>
					{#if rankData.plus}
						<div
							class="bg-[{rankPlus}] pr-[8px] relative z-[1] inline-block before:content-[''] before:z-[-1] before:absolute before:top-0 before:bottom-[-0.1rem] before:left-[-7px] before:right-0 before:[transform:skew(-20deg)] before:bg-inherit"
						>
							{rankData.plus}
						</div>
					{/if}
				</div>
			{/if}
			{account.name}
		</div>
		<div slot="popover-content" data-sveltekit-preload-data="tap">
			{#each profileMembers as member, memberIndex (member.uuid)}
				<PopoverItem href="/@{member.ign}" index={memberIndex} totalItems={profileMembers.length}
					>{member.ign}</PopoverItem
				>
			{/each}
		</div>
	</Popover>
	<span>on</span>
	<Popover id="stats-for-profile">
		<div slot="display-content">{cuteName}</div>
		<div slot="popover-content" data-sveltekit-preload-data="tap">
			{#each profiles as profile, profileIndex (profile.id)}
				<PopoverItem href="/@{account.name}/{profile.cuteName}" index={profileIndex} totalItems={profiles.length}
					>{profile.cuteName}</PopoverItem
				>
			{/each}
		</div>
	</Popover>
	<div class="text-[15px] relative w-full">Extra Stats Here</div>
</div>
