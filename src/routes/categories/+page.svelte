<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { products, categories } from '../../lib/data/products';

	const countFor = (name: string) => products.filter((p) => p.category === name).length;
</script>

<svelte:head>
	<title>Shop by Category — ShopMate</title>
	<meta
		name="description"
		content="Browse ShopMate categories — Electronics, Fashion, Home & Kitchen, Beauty, Sports and Accessories — and pick one to see its matching products."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/categories" />
	<meta property="og:title" content="Shop by Category — ShopMate" />
	<meta
		property="og:description"
		content="Browse ShopMate categories — Electronics, Fashion, Home & Kitchen, Beauty, Sports and Accessories — and pick one to see its matching products."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/categories" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Shop by Category — ShopMate" />
	<meta
		name="twitter:description"
		content="Browse ShopMate categories — Electronics, Fashion, Home & Kitchen, Beauty, Sports and Accessories — and pick one to see its matching products."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Shop by Category</h1>
	<p class="mt-1 text-sm text-stone-500">Browse our collections — pick a category to see matching products.</p>

	<div class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
		{#each categories as cat (cat.name)}
			{@const count = countFor(cat.name)}
			<a
				href="/shop?category={encodeURIComponent(cat.name)}"
				class="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="relative aspect-[4/3] overflow-hidden">
					<img
						src={cat.photo}
						alt={cat.name}
						loading="lazy"
						decoding="async"
						width="456"
						height="456"
						class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0"></div>
					<span class="absolute bottom-3 left-4 text-lg font-extrabold text-white drop-shadow">{cat.name}</span>
				</div>
				<div class="flex items-center justify-between px-4 py-3.5 sm:px-5">
					<span class="text-sm text-stone-500">
						{#if count > 0}
							{count} product{count === 1 ? '' : 's'}
						{:else}
							New arrivals
						{/if}
					</span>
					<span class="flex items-center gap-1 text-sm font-semibold text-olive transition group-hover:gap-2">
						Shop now <Icon name="arrow-right" class="h-4 w-4" />
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
