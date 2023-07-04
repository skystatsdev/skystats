<script lang="ts">
	import { onMount } from 'svelte';

	export let uuid: string;

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const skin = await import('skinview3d');
		const cape: string | undefined = await fetch(`https://api.capes.dev/load/${uuid}/`).then(async (res) => {
			const data = await res.json();
			if (data?.optifine?.exists) {
				return data.optifine.imageUrl;
			} else if (data?.minecraft?.exists) {
				return data.minecraft.imageUrl;
			} else {
				return undefined;
			}
		});

		new skin.SkinViewer({
			canvas: canvas,
			width: 350,
			height: 500,
			skin: `https://mc-heads.net/skin/${uuid}`,
			cape: cape,
			animation: new skin.IdleAnimation()
		});
	});
</script>

<canvas bind:this={canvas} class="absolute top-[50%] left-[50%] cursor-grab translate-x-[-50%] translate-y-[-50%]" />
