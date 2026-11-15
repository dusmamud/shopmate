<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { categories, products, type Product } from '../../lib/data/products';
	import { shop } from '../../lib/data/store.svelte';

	type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';

	let q = $state('');
	let category = $state('All');
	let sort = $state<SortKey>('featured');
	let added = $state(new Set<number>());

	// Read ?q= / ?category= only in the browser: searchParams is unavailable
	// while the page is prerendered on the server. $effect never runs on the
	// server, so this also stays in sync on same-page navigation.
	$effect(() => {
		q = page.url.searchParams.get('q') ?? '';
		category = page.url.searchParams.get('category') ?? 'All';
	});

	const categoryCounts = $derived.by(() => {
		const counts = new Map<string, number>();
		for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
		return counts;
	});

	const filtered = $derived.by(() => {
		let list: Product[] = products;
		if (category !== 'All') list = list.filter((p) => p.category === category);
		const needle = q.trim().toLowerCase();
		if (needle) {
			list = list.filter(
				(p) => p.name.toLowerCase().includes(needle) || p.category.toLowerCase().includes(needle)
			);
		}
		switch (sort) {
			case 'price-asc':
				return [...list].sort((a, b) => a.price - b.price);
			case 'price-desc':
				return [...list].sort((a, b) => b.price - a.price);
			case 'rating':
				return [...list].sort((a, b) => b.rating - a.rating);
			case 'discount':
				return [...list].sort(
					(a, b) => b.oldPrice - b.price - (a.oldPrice - a.price)
				);
			default:
				return list;
		}
	});

	function syncUrl() {
		const params = new URLSearchParams();
		if (q.trim()) params.set('q', q.trim());
		if (category !== 'All') params.set('category', category);
		const qs = params.toString();
		goto(qs ? `/shop?${qs}` : '/shop', { replaceState: true });
	}

	function pickCategory(name: string) {
		category = name;
		syncUrl();
	}

	function addToCart(id: number) {
		shop.addToCart(id);
		added.add(id);
		added = new Set(added);
		setTimeout(() => {
			added.delete(id);
			added = new Set(added);
		}, 1400);
	}
</script>

<svelte:head>
	<title>Shop — ShopMate</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Shop All Products</h1>
	<p class="mt-1 text-sm text-stone-500">
		{filtered.length} {filtered.length === 1 ? 'product' : 'products'}
		{#if category !== 'All'} in {category}{/if}
		{#if q.trim()} matching “{q.trim()}”{/if}
	</p>

	<!-- Search -->
	<form
		class="mt-5"
		onsubmit={(e) => {
			e.preventDefault();
			syncUrl();
		}}
	>
		<label class="relative block">
			<span class="sr-only">Search products</span>
			<Icon name="search" class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
			<input
				type="search"
				bind:value={q}
				oninput={syncUrl}
				placeholder="Search products..."
				class="w-full rounded-lg border border-line bg-white py-3 pr-4 pl-11 text-sm text-ink placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
			/>
		</label>
	</form>

	<!-- Category chips -->
	<div class="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
		<button
			type="button"
			onclick={() => pickCategory('All')}
			aria-pressed={category === 'All'}
			class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition {category === 'All'
				? 'bg-olive text-white'
				: 'border border-line bg-white text-ink hover:border-olive'}"
		>
			All ({products.length})
		</button>
		{#each categories as cat}
			<button
				type="button"
				onclick={() => pickCategory(cat.name)}
				aria-pressed={category === cat.name}
				class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition {category === cat.name
					? 'bg-olive text-white'
					: 'border border-line bg-white text-ink hover:border-olive'}"
			>
				{cat.name} ({categoryCounts.get(cat.name) ?? 0})
			</button>
		{/each}
	</div>

	<!-- Sort -->
	<div class="mt-4 flex items-center justify-between gap-3">
		<p class="text-sm text-stone-500">
			Showing <span class="font-semibold text-ink">{filtered.length}</span> of {products.length} products
		</p>
		<label class="flex items-center gap-2 text-sm text-stone-500">
			<Icon name="sliders" class="h-4 w-4" />
			<span class="sr-only sm:not-sr-only">Sort by</span>
			<select
				bind:value={sort}
				class="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
			>
				<option value="featured">Featured</option>
				<option value="price-asc">Price: Low to High</option>
				<option value="price-desc">Price: High to Low</option>
				<option value="rating">Top Rated</option>
				<option value="discount">Biggest Discount</option>
			</select>
		</label>
	</div>

	{#if filtered.length === 0}
		<div class="mt-10 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center">
			<Icon name="search" class="mx-auto h-10 w-10 text-stone-300" />
			<p class="mt-4 text-base font-semibold text-ink">No products found</p>
			<p class="mt-1 text-sm text-stone-500">
				Try a different search or category.
			</p>
			<button
				type="button"
				onclick={() => {
					q = '';
					pickCategory('All');
				}}
				class="mt-5 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Clear Filters
			</button>
		</div>
	{:else}
		<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
			{#each filtered as product (product.id)}
				<article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
						<a href="/product/{product.id}" aria-label={product.name} class="block h-full w-full">
							<img
								src={product.src}
								alt={product.name}
								loading="lazy"
								class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
							/>
						</a>
						<button
							type="button"
							aria-label={shop.isWished(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
							aria-pressed={shop.isWished(product.id)}
							onclick={() => shop.toggleWishlist(product.id)}
							class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 {shop.isWished(product.id)
								? 'text-red-500'
								: 'text-stone-500'}"
						>
							<Icon
								name="heart"
								class="h-4 w-4 {shop.isWished(product.id) ? 'fill-red-500' : ''}"
							/>
						</button>
					</div>
					<div class="flex flex-1 flex-col p-3 sm:p-4">
						<h2 class="text-sm font-semibold text-ink">
							<a href="/product/{product.id}" class="hover:text-olive">{product.name}</a>
						</h2>
						<p class="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
							<Stars rating={product.rating} />
							<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
							<span>({product.reviews})</span>
						</p>
						<p class="mt-2 flex items-baseline gap-2">
							<span class="text-base font-extrabold text-ink">${product.price.toFixed(2)}</span>
							<span class="text-xs text-stone-400 line-through">${product.oldPrice.toFixed(2)}</span>
						</p>
						<button
							type="button"
							onclick={() => addToCart(product.id)}
							class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
								? 'bg-olive-dark'
								: 'bg-olive hover:bg-olive-dark'}"
						>
							<Icon name={added.has(product.id) ? 'check' : 'cart'} class="h-4 w-4" />
							{added.has(product.id) ? 'Added to Cart' : 'Add to Cart'}
						</button>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
