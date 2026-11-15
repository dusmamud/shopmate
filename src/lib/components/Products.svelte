<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
	import Stars from './Stars.svelte';
	import { products } from '../data/products';
	import { shop } from '../data/store.svelte';

	let added = $state(new Set<number>());

	const filtered = $derived(
		shop.search.trim()
			? products.filter((p) => p.name.toLowerCase().includes(shop.search.trim().toLowerCase()))
			: products
	);

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

<section id="products" class="mx-auto max-w-7xl scroll-mt-24 px-4 pt-12 sm:px-6 lg:px-8" use:reveal>
	<div class="flex items-end justify-between gap-4">
		<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
			{shop.search.trim() ? `Results for “${shop.search.trim()}”` : 'Best Selling Products'}
		</h2>
		<a href="/shop" class="flex shrink-0 items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark">
			View All Products <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>

	{#if filtered.length === 0}
		<p class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-10 text-center text-sm text-stone-500">
			No products match “{shop.search.trim()}”. Try another search.
		</p>
	{:else}
		<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
			{#each filtered as product (product.id)}
				<article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
						<img
							src={product.src}
							alt={product.name}
							loading="lazy"
							class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
						/>
						<button
							type="button"
							aria-label={`Quick view ${product.name}`}
							onclick={() => shop.openQuickView(product.id)}
							class="absolute top-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-500 shadow transition hover:scale-110"
						>
							<Icon name="eye" class="h-5 w-5" />
						</button>
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
						<h3 class="text-sm font-semibold text-ink">{product.name}</h3>
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
</section>
