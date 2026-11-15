<script lang="ts">
	import Icon from './Icon.svelte';

	let { items }: { items: { label: string; href?: string }[] } = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center gap-1.5 text-sm">
		<li>
			<a href="/" class="flex items-center gap-1.5 text-stone-500 transition hover:text-olive">
				<Icon name="home" class="h-4 w-4" />
				Home
			</a>
		</li>
		{#each items as item, i}
			<li class="flex items-center gap-1.5" aria-current={i === items.length - 1 ? 'page' : undefined}>
				<Icon name="chevron-right" class="h-4 w-4 text-stone-300" />
				{#if item.href && i < items.length - 1}
					<a href={item.href} class="text-stone-500 transition hover:text-olive">{item.label}</a>
				{:else}
					<span class="font-semibold text-ink">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
