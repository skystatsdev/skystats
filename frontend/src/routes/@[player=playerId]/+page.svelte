<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: player = data.player;
</script>

<h1>{player.username} Profiles</h1>

{#each player.skyblock.profiles as profile}
	<a href="/@{player.username}/{profile.name}" class="text-blue-600">
		<p>{profile.name}</p>
	</a>
{/each}
