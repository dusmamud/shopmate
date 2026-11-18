<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { products } from '../lib/data/products';

	const is404 = page.status === 404;

	let q = $state('');

	/** Top 4 products by review count. */
	const bestSellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);

	function search(e: Event) {
		e.preventDefault();
		const needle = q.trim();
		goto(needle ? `/shop?q=${encodeURIComponent(needle)}` : '/shop');
	}
</script>

<svelte:head>
	<title>{is404 ? 'Page not found' : 'Something went wrong'} — ShopMate</title>
</svelte:head>

<main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<div class="flex flex-col items-center justify-center text-center">
		<p class="text-6xl font-extrabold text-olive">{page.status}</p>
		<h1 class="mt-4 text-2xl font-extrabold text-ink">
			{is404 ? 'This page is out of stock' : 'Something went wrong'}
		</h1>
		<p class="mt-2 max-w-sm text-sm text-stone-500">
			{#if is404}
				{page.error?.message ?? 'The page you are looking for does not exist.'}
			{:else}
				{page.error?.message ?? 'Something went wrong on our side. Please try again.'}
			{/if}
		</p>

		{#if is404}
			<form class="mt-6 w-full max-w-md" onsubmit={search}>
				<label class="relative block">
					<span class="sr-only">Search products</span>
					<Icon
						name="search"
						class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400"
					/>
					<input
						type="search"
						bind:value={q}
						placeholder="Search products..."
						class="w-full rounded-lg border border-line bg-white py-3 pr-4 pl-11 text-sm text-ink placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
					/>
				</label>
				<button
					type="submit"
					class="mt-3 w-full rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
				>
					Search
				</button>
			</form>
		{/if}

		<div class="mt-6 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Back to Shop
			</a>
			<a
				href="/shop"
				class="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive"
			>
				Shop All Products
			</a>
		</div>
	</div>

	{#if is404}
		<section class="mt-14">
			<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Best sellers</h2>
			<p class="mt-1 text-sm text-stone-500">Our most-loved products while you're here.</p>
			<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
				{#each bestSellers as product (product.id)}
					<a
						href="/product/{product.id}"
						class="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
					>
						<span class="block aspect-square overflow-hidden bg-[#f6f1e7]">
							<img
								src={product.src}
								srcset={product.src.includes('backpack') || product.src.includes('headphones')
									? `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src.replace('.webp', '-1200.webp')} 1200w, ${product.src} 1600w`
									: `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src} ${product.src.includes('lamp') || product.src.includes('tshirt') ? 1120 : 912}w`}
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 300px"
								alt={product.name}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
							/>
						</span>
						<span class="block p-3 sm:p-4">
							<span class="block text-sm font-semibold text-ink group-hover:text-olive">
								{product.name}
							</span>
							<span class="mt-1.5 flex items-center gap-1 text-xs text-stone-500">
								<Stars rating={product.rating} class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
								<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
								<span>({product.reviews})</span>
							</span>
							<span class="mt-2 flex items-baseline gap-2">
								<span class="text-base font-extrabold text-ink">${product.price.toFixed(2)}</span>
								<span class="text-xs text-stone-500 line-through">${product.oldPrice.toFixed(2)}</span>
							</span>
						</span>
					</a>
				{/each}
			</div>
		</section>

		<nav
			class="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-olive"
			aria-label="Popular pages"
		>
			<a href="/shop" class="hover:text-olive-dark">Shop All Products</a>
			<a href="/categories" class="hover:text-olive-dark">Categories</a>
			<a href="/deals" class="hover:text-olive-dark">Deals</a>
			<a href="/help" class="hover:text-olive-dark">Help Center</a>
		</nav>
	{/if}
</main>
