<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';
	import { products } from '../../lib/data/products';
	import { shop, formatPrice } from '../../lib/data/store.svelte';

	const arrivals = products.filter((p) => p.isNew);

	let added = $state(new Set<number>());

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
	<title>New Arrivals — ShopMate</title>
	<meta
		name="description"
		content="The newest products at ShopMate — fresh drops across electronics, fashion, home and more."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'New Arrivals' }]} />
	<div class="mt-4" use:reveal>
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">New Arrivals</h1>
		<p class="mt-1 max-w-2xl text-sm text-stone-500 sm:text-base">
			Fresh on the shelf — the latest products we have added, across electronics, fashion, home and
			more.
		</p>
	</div>

	{#if arrivals.length === 0}
		<div class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-400">
				<Icon name="bag" class="h-8 w-8" />
			</div>
			<h2 class="mt-4 text-lg font-bold text-ink">No new arrivals right now</h2>
			<p class="mt-1 text-sm text-stone-500">Check back soon — new products land here first.</p>
			<a
				href="/shop"
				class="press mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Browse All Products <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
			{#each arrivals as product, i (product.id)}
				<article style="--i: {i}" class="card-in group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
						<a href="/product/{product.id}" aria-label={product.name} class="block h-full w-full">
							<img
								src={product.src}
								alt={product.name}
								loading="lazy"
								class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
							/>
						</a>
						<span
							class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-extrabold text-white shadow"
						>
							New
						</span>
						<button
							type="button"
							aria-label={`Quick view ${product.name}`}
							onclick={() => shop.openQuickView(product.id)}
							class="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-500 shadow transition hover:scale-110"
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
							<Icon name="heart" class="h-4 w-4 {shop.isWished(product.id) ? 'fill-red-500' : ''}" />
						</button>
					</div>

					<div class="flex flex-1 flex-col p-3 sm:p-4">
						<h3 class="text-sm font-semibold text-ink">
							<a href="/product/{product.id}" class="hover:text-olive">{product.name}</a>
						</h3>
						<p class="mt-1.5 flex items-center gap-1 text-xs text-stone-500">
							<Stars rating={product.rating} class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
							<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
							<span>({product.reviews})</span>
						</p>
						<p class="mt-2 flex items-baseline gap-2">
							<span class="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
							<span class="text-xs text-stone-400 line-through">{formatPrice(product.oldPrice)}</span>
						</p>
						<button
							type="button"
							onclick={() => addToCart(product.id)}
							class="press mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
								? 'bg-olive-dark'
								: 'bg-olive hover:bg-olive-dark'}"
						>
							<Icon name={added.has(product.id) ? 'check' : 'cart'} class="h-4 w-4" />
							{added.has(product.id) ? 'Added to Cart' : 'Add to Cart'}
						</button>
						<button
							type="button"
							onclick={() => shop.toggleCompare(product.id)}
							aria-pressed={shop.isCompared(product.id)}
							class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition {shop.isCompared(product.id)
								? 'bg-olive-soft text-olive'
								: 'text-stone-500 hover:bg-cream hover:text-olive'}"
						>
							<Icon name={shop.isCompared(product.id) ? 'check' : 'sliders'} class="h-4 w-4" />
							{shop.isCompared(product.id) ? 'Added to Compare' : 'Add to Compare'}
						</button>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
