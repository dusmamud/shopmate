<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { getProduct, relatedProducts } from '../../../lib/data/products';
	import { shop } from '../../../lib/data/store.svelte';

	const product = $derived(getProduct(Number(page.params.id)));
	const related = $derived(product ? relatedProducts(product.id) : []);

	let qty = $state(1);
	let added = $state(false);

	const savePct = $derived(
		product ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0
	);

	function stepQty(delta: number) {
		if (!product) return;
		qty = Math.min(product.stock, Math.max(1, qty + delta));
	}

	function addToCart() {
		if (!product) return;
		shop.addToCart(product.id, qty);
		added = true;
		setTimeout(() => (added = false), 1400);
	}

	function buyNow() {
		if (!product) return;
		shop.addToCart(product.id, qty);
		goto('/checkout');
	}

	function addRelated(id: number) {
		shop.addToCart(id);
	}
</script>

<svelte:head>
	<title>{product ? `${product.name} — ShopMate` : 'Product not found — ShopMate'}</title>
</svelte:head>

{#if !product}
	<div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
		<Icon name="alert" class="mx-auto h-12 w-12 text-stone-300" />
		<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink">Product not found</h1>
		<p class="mt-2 text-sm text-stone-500">This product does not exist or was removed.</p>
		<a
			href="/shop"
			class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			Browse All Products <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>
{:else}
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
			<a href="/" class="hover:text-olive">Home</a>
			<span class="mx-1.5">/</span>
			<a href="/shop?category={encodeURIComponent(product.category)}" class="hover:text-olive">
				{product.category}
			</a>
			<span class="mx-1.5">/</span>
			<span class="font-medium text-ink">{product.name}</span>
		</nav>

		<div class="mt-5 grid gap-8 lg:grid-cols-2">
			<div class="overflow-hidden rounded-2xl border border-line bg-[#f6f1e7]">
				<img src={product.src} alt={product.name} class="aspect-square w-full object-cover" />
			</div>

			<div>
				<p class="text-xs font-bold tracking-widest text-olive uppercase">{product.category}</p>
				<h1 class="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
					{product.name}
				</h1>
				<p class="mt-2 flex items-center gap-2 text-sm text-stone-500">
					<Stars rating={product.rating} class="h-4 w-4" />
					<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
					<span>({product.reviews} reviews)</span>
				</p>

				<p class="mt-4 flex flex-wrap items-baseline gap-3">
					<span class="text-3xl font-extrabold text-ink">${product.price.toFixed(2)}</span>
					<span class="text-base text-stone-400 line-through">${product.oldPrice.toFixed(2)}</span>
					<span class="rounded-full bg-olive-soft px-2.5 py-1 text-xs font-bold text-olive">
						Save {savePct}%
					</span>
				</p>

				<p class="mt-4 text-sm leading-relaxed text-stone-600">{product.desc}</p>

				<p class="mt-4 flex items-center gap-2 text-sm font-medium">
					{#if product.stock > 0}
						<span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
						<span class="text-green-700">In stock</span>
						<span class="text-stone-400">· {product.stock} left</span>
					{:else}
						<span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
						<span class="text-red-600">Out of stock</span>
					{/if}
				</p>

				<div class="mt-6 flex flex-wrap items-center gap-3">
					<div class="flex items-center rounded-lg border border-line bg-white">
						<button
							type="button"
							onclick={() => stepQty(-1)}
							disabled={qty <= 1}
							aria-label="Decrease quantity"
							class="flex h-11 w-11 items-center justify-center text-ink transition hover:text-olive disabled:opacity-40"
						>
							<Icon name="minus" class="h-4 w-4" />
						</button>
						<span class="w-10 text-center text-sm font-bold text-ink" aria-live="polite">{qty}</span>
						<button
							type="button"
							onclick={() => stepQty(1)}
							disabled={qty >= product.stock}
							aria-label="Increase quantity"
							class="flex h-11 w-11 items-center justify-center text-ink transition hover:text-olive disabled:opacity-40"
						>
							<Icon name="plus" class="h-4 w-4" />
						</button>
					</div>
					<button
						type="button"
						onclick={() => shop.toggleWishlist(product.id)}
						aria-pressed={shop.isWished(product.id)}
						class="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white transition hover:border-olive {shop.isWished(product.id)
							? 'text-red-500'
							: 'text-stone-500'}"
						aria-label={shop.isWished(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
					>
						<Icon name="heart" class="h-5 w-5 {shop.isWished(product.id) ? 'fill-red-500' : ''}" />
					</button>
				</div>

				<div class="mt-4 flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onclick={addToCart}
						disabled={product.stock <= 0}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition {added
							? 'bg-olive-dark'
							: 'bg-olive hover:bg-olive-dark'} disabled:opacity-50"
					>
						<Icon name={added ? 'check' : 'cart'} class="h-4 w-4" />
						{added ? 'Added to Cart' : 'Add to Cart'}
					</button>
					<button
						type="button"
						onclick={buyNow}
						disabled={product.stock <= 0}
						class="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-olive px-5 py-3 text-sm font-semibold text-olive transition hover:bg-olive-soft disabled:opacity-50"
					>
						Buy Now <Icon name="arrow-right" class="h-4 w-4" />
					</button>
				</div>

				<div class="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
					<div>
						<Icon name="truck" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">Free shipping over $50</p>
					</div>
					<div>
						<Icon name="returns" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">30-day returns</p>
					</div>
					<div>
						<Icon name="shield" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">Secure payment</p>
					</div>
				</div>
			</div>
		</div>

		{#if related.length > 0}
			<section class="mt-14">
				<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">You May Also Like</h2>
				<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{#each related as rel (rel.id)}
						<article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
							<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
								<a href="/product/{rel.id}" aria-label={rel.name} class="block h-full w-full">
									<img
										src={rel.src}
										alt={rel.name}
										loading="lazy"
										class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</a>
								<button
									type="button"
									aria-label={shop.isWished(rel.id) ? `Remove ${rel.name} from wishlist` : `Save ${rel.name} to wishlist`}
									aria-pressed={shop.isWished(rel.id)}
									onclick={() => shop.toggleWishlist(rel.id)}
									class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 {shop.isWished(rel.id)
										? 'text-red-500'
										: 'text-stone-500'}"
								>
									<Icon name="heart" class="h-4 w-4 {shop.isWished(rel.id) ? 'fill-red-500' : ''}" />
								</button>
							</div>
							<div class="flex flex-1 flex-col p-3 sm:p-4">
								<h3 class="text-sm font-semibold text-ink">
									<a href="/product/{rel.id}" class="hover:text-olive">{rel.name}</a>
								</h3>
								<p class="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
									<Stars rating={rel.rating} />
									<span class="font-semibold text-ink">{rel.rating.toFixed(1)}</span>
									<span>({rel.reviews})</span>
								</p>
								<p class="mt-2 flex items-baseline gap-2">
									<span class="text-base font-extrabold text-ink">${rel.price.toFixed(2)}</span>
									<span class="text-xs text-stone-400 line-through">${rel.oldPrice.toFixed(2)}</span>
								</p>
								<button
									type="button"
									onclick={() => addRelated(rel.id)}
									class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
								>
									<Icon name="cart" class="h-4 w-4" /> Add to Cart
								</button>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</div>
{/if}
