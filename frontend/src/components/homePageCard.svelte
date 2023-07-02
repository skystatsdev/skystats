<script lang="ts">
    export let username: string
    export let description: string
</script>

<a href="/@{username}">
    <div class="
        container
        hover:scale-[1.02]
        duration-150
        ease-in-out
        flex
        space-x-4
        p-4 
        select-none 
        rounded-md 
        backdrop-blur-lg
        backdrop-brightness-50
        min-w-full"
    >
        <img 
            src="https://mc-heads.net/avatar/{username}" 
            alt={username} 
            class="w-16 h-16 rounded-md block"
        />
        <div class="mt-auto mb-auto">
            <p class="text-neutral-200 font-[450] text-md">{username}</p>
            <p class="text-zinc-300 font-[250] text-sm">{description}</p>
        </div>
    </div>
</a>