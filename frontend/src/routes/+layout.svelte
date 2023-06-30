<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<meta name="author" content="SkyStats Team" />
	<meta name="robots" content="index, follow" />
	<meta property="og:url" content={$page.url.toString()} />
</svelte:head>

<slot />

<style lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
