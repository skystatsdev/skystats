<script lang="ts">
	import type { PlayerSkyblockProfileData } from '$types/hypixel';
	import { type RankInformation } from '$constants';

	import Popover from '$comp/PlayerProfile/Popover.svelte';
	import PopoverItem from '$comp/PlayerProfile/PopoverItem.svelte';
	import type { MinecraftAccountResponse } from '$api/mojang';

	export let rankData: RankInformation | undefined;
	export let account: MinecraftAccountResponse;
	export let playerProfiles: PlayerSkyblockProfileData[];
	export let cuteName: string;

	$: currentProfile = playerProfiles.find((profile) => profile.cuteName === cuteName);

	$: profileMembers =
		currentProfile?.members.filter((member) => member.uuid !== account.id).sort((a, b) => b.ign.localeCompare(a.ign)) ??
		[];

	$: profiles = playerProfiles
		.filter((profile) => profile.id !== currentProfile?.id)
		.filter((profile) => profile.removed === false)
		.sort((a, b) => b.cuteName.localeCompare(a.cuteName));

	function getGameModeIcon(gameMode?: string) {
		if (!gameMode) return '';
		switch (gameMode) {
			case 'ironman':
				return '/icons/ironman.png';
			case 'island':
				return '/icons/island.png';
			case 'bingo':
				return '/icons/bingo.png';
			default:
				return '';
		}
	}
</script>

<div class="text-[36px] mt-[50px] mb-[20px] flex flex-wrap gap-x-[10px] gap-y-[8px] items-center">
	<span>Stats for</span>
	<Popover id="stats-for-player">
		<div slot="display-content">
			{#if rankData}
				<div
					class="inline-flex text-[18px] h-[34px] leading-[34px] mt-[10px] ml-[-5px] rounded-[100px] align-top font-[700] overflow-clip"
				>
					<div class="bg-[{rankData.color}] px-[15px] inline-block">
						{rankData.tag}
					</div>
					{#if rankData.plus}
						<div
							class="bg-[{rankData.plusColor}] pr-[8px] relative z-[1] inline-block before:content-[''] before:z-[-1] before:absolute before:top-0 before:bottom-[-0.1rem] before:left-[-7px] before:right-0 before:[transform:skew(-20deg)] before:bg-inherit"
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
		<span slot="display-content" class="flex relative items-center space-x-4">
			{cuteName}
			{#if currentProfile?.gameMode !== 'normal'}
				<img
					class="h-[32px] mt-[-5px] ml-[-5px] align-middle"
					src={getGameModeIcon(currentProfile?.gameMode)}
					alt="game mode"
				/>
			{/if}
		</span>
		<div slot="popover-content" data-sveltekit-preload-data="tap">
			{#each profiles as profile, profileIndex (profile.id)}
				<PopoverItem href="/@{account.name}/{profile.cuteName}" index={profileIndex} totalItems={profiles.length}>
					<div class="flex items-center space-x-4">
						{profile.cuteName}
						{#if profile.gameMode !== 'normal'}
							<img
								class="h-[32px] align-middle overflow-clip overflow-clip-margin-content-box"
								src={getGameModeIcon(profile.gameMode)}
								alt="game mode"
							/>
						{/if}
					</div>
				</PopoverItem>
			{/each}
		</div>
	</Popover>
	<div class="text-[15px] relative w-full">Extra Stats Here</div>
</div>
