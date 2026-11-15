<script lang="ts">
	import Icon from './Icon.svelte';
	let { rating = 5, class: cls = 'h-3.5 w-3.5' }: { rating?: number; class?: string } = $props();
</script>

<span class="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
	{#each [1, 2, 3, 4, 5] as i}
		<Icon
			name="star"
			class={`${cls} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`}
		/>
	{/each}
</span>
