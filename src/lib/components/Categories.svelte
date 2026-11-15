<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
	import { categories } from '../data/products';
</script>

<section id="categories" class="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8" use:reveal>
	<div class="flex items-end justify-between gap-4">
		<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Shop by Categories</h2>
		<a href="/categories" class="flex shrink-0 items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark">
			View All Categories <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>

	<div class="no-scrollbar mt-6 flex gap-5 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
		{#each categories as cat}
			<a href="/shop?category={encodeURIComponent(cat.name)}" class="group w-24 shrink-0 text-center sm:w-auto">
				<span
					class="mx-auto block h-24 w-24 overflow-hidden rounded-full transition duration-300 group-hover:scale-105 group-hover:shadow-lg sm:h-28 sm:w-28"
				>
					<img
						src={cat.photo}
						alt={cat.name}
						loading="lazy"
						class="h-full w-full object-cover transition duration-300 group-hover:scale-110"
					/>
				</span>
				<span class="mt-3 block text-xs font-semibold text-ink sm:text-sm">{cat.name}</span>
			</a>
		{/each}
	</div>
</section>
