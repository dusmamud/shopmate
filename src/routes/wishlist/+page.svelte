<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { getProduct, type Product } from '../../lib/data/products';
	import { shop, formatPrice } from '../../lib/data/store.svelte';

	const saved = $derived(
		[...shop.wishlist].map((id) => getProduct(id)).filter((p): p is Product => !!p)
	);

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

	function addAllToCart() {
		for (const p of saved) shop.addToCart(p.id, 1, { silent: true });
		shop.openCart();
	}
</script>

<svelte:head>
	<title>My Wishlist — ShopMate</title>
	<meta name="description" content="Your saved ShopMate products — move them to your cart anytime. Free shipping over $50." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Wishlist' }]} />
	<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
		My Wishlist {#if saved.length > 0}<span class="text-stone-400">({saved.length})</span>{/if}
	</h1>
	<p class="mt-1 text-sm text-stone-500">Products you've saved for later. They stay on this device.</p>
	{#if saved.length > 0}
		<button
			type="button"
			onclick={addAllToCart}
			class="mt-4 flex items-center gap-2 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			<Icon name="cart" class="h-4 w-4" /> Add all {saved.length} to Cart
		</button>
	{/if}

	{#if saved.length === 0}
		<div class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-400">
				<Icon name="heart" class="h-8 w-8" />
			</div>
			<h2 class="mt-4 text-lg font-bold text-ink">Your wishlist is empty</h2>
			<p class="mt-1 text-sm text-stone-500">Tap the heart on any product to save it here for later.</p>
			<a
				href="/shop"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Browse Products <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
			{#each saved as product (product.id)}
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
							aria-label="Remove {product.name} from wishlist"
							onclick={() => shop.toggleWishlist(product.id)}
							class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-500 shadow transition hover:scale-110"
						>
							<Icon name="heart" class="h-4 w-4 fill-red-500" />
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
							<span class="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
							<span class="text-xs text-stone-400 line-through">{formatPrice(product.oldPrice)}</span>
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
						<button
							type="button"
							onclick={() => shop.toggleWishlist(product.id)}
							class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-600"
						>
							<Icon name="trash" class="h-4 w-4" />
							Remove from wishlist
						</button>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
