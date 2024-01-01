<script lang="ts">
	import { Popover } from 'flowbite-svelte';
	import { slide } from 'svelte/transition';

	export let id: string;
</script>

<span
	class="relative inline-block font-semibold cursor-context-menu bg-[rgba(127,127,127,.2)] rounded-[100px] h-[54px] leading-[54px] px-[15px] align-middle text-[30px] min-w-[fit-content]"
	{id}
>
	<slot name="display-content" />
</span>
<Popover
	offset={0}
	triggeredBy="#{id}"
	placement="bottom-start"
	arrow={false}
	transition={slide}
	defaultClass=""
	class="top-[100%] min-w-[260px] rounded-[17px] border-0 border-transparent px-0 py-0 m-0 bg-[rgba(30,30,30,0.95)] z-[100]"
>
	<slot name="popover-content" />
</Popover>
