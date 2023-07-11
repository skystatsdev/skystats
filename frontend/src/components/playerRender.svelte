<script lang="ts">
	import { browser } from '$app/environment';

	export let username: string;

	let canvas: HTMLCanvasElement;

	$: (async () => {
		if (browser) {
			const skin = await import('skinview3d');
			const cape = await fetch(`https://api.capes.dev/load/${username}/`).then(async (res) => {
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
				canvas,
				width: 350,
				height: 500,
				skin: `https://mc-heads.net/skin/${username}`,
				cape: cape,
				animation: new skin.IdleAnimation()
			});
		}
	})();
</script>

<div class="fixed top-[20vh] left-0 w-[30vw] bottom-[5vh]">
	<canvas bind:this={canvas} class="absolute top-[50%] left-[50%] cursor-grab translate-x-[-50%] translate-y-[-50%]" />
</div>
