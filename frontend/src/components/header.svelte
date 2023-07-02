<script lang="ts">
    export let showSearchBar: boolean = true;
</script>

<header class="sticky top-0 left-0 right-0 z-[1000] h-12 flex flex-row justify-between align-center pt-4 px-4 bg-zinc-800 leading-[48px]">
    <a class="font-bold text-white text-lg tracking-wide" href="/">
        SkyStats
    </a>
    <form
        class="relative flex-grow flex-shrink max-w-lg h-9 bg-zinc-800/20 rounded-[18px] {showSearchBar ?? 'hidden'}"
    >
        <input 
            type="text" 
            placeholder="Search"
            class="absolute top-0 left-0 right-0 rounded-inherit h-[100%] w-[100%] pr-[65px] pl-[15px]"
        />
    </form>
</header>