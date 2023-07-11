<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<meta name="author" content="SkyStats Team" />
	<meta name="robots" content="index, follow" />
	<meta property="og:url" content={$page.url.toString()} />
</svelte:head>

<slot />
