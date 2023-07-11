<script lang="ts">
	export let href: string;
	export let totalItems: number;
	export let index: number;
</script>

<a
	{href}
	class="block text-white font-semibold p-[20px] text-[30px] min-w-[200px] box-border bg-transparent hover:bg-[rgba(255,255,255,0.2)] {index ===
		0 && 'rounded-t-[17px]'} {index === totalItems - 1 && 'rounded-b-[17px]'}"
>
	<slot />
</a>
