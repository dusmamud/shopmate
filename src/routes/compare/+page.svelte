<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';
	import { getProduct, type Product } from '../../lib/data/products';
	import { shop, formatPrice } from '../../lib/data/store.svelte';

	const compared = $derived(
		shop.compare.map((id) => getProduct(id)).filter((p): p is Product => !!p)
	);

	let added = $state(new Set<number>());

	function addToCart(id: number) {
		shop.addToCart(id, 1, { openDrawer: false });
		added.add(id);
		added = new Set(added);
		setTimeout(() => {
			added.delete(id);
			added = new Set(added);
		}, 1400);
	}

	function stockLabel(p: Product) {
		if (p.stock <= 0) return { text: 'Out of stock', cls: 'text-red-600' };
		if (p.stock <= 5) return { text: `Only ${p.stock} left`, cls: 'text-amber-600' };
		return { text: 'In stock', cls: 'text-green-700' };
	}
</script>

<svelte:head>
	<title>Compare Products — ShopMate</title>
	<meta
		name="description"
		content="Compare ShopMate products side by side — price, ratings, brand, stock and key specs — and pick the right one."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Compare' }]} />
	<div class="mt-4 flex flex-wrap items-end justify-between gap-3">
		<div>
			<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
				Compare Products
				{#if compared.length > 0}<span class="text-stone-400">({compared.length})</span>{/if}
			</h1>
			<p class="mt-1 text-sm text-stone-500">
				Side by side, so you can pick the one that fits best. Add up to 4 products from any product
				card.
			</p>
		</div>
		{#if compared.length > 0}
			<button
				type="button"
				onclick={() => shop.clearCompare()}
				class="press flex items-center gap-1.5 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:border-red-300 hover:text-red-600"
			>
				<Icon name="trash" class="h-4 w-4" /> Clear all
			</button>
		{/if}
	</div>

	{#if compared.length === 0}
		<div
			class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center"
			use:reveal
		>
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-stone-400">
				<Icon name="sliders" class="h-8 w-8" />
			</div>
			<h2 class="mt-4 text-lg font-bold text-ink">Nothing to compare yet</h2>
			<p class="mx-auto mt-1 max-w-sm text-sm text-stone-500">
				Use the Compare button on any product card or product page to add products here — up to 4
				at a time.
			</p>
			<a
				href="/shop"
				class="press mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Browse Products <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{#each compared as product, i (product.id)}
				<article
					style="--i: {i}"
					class="card-in flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
				>
					<div class="relative aspect-[4/3] overflow-hidden bg-[#f6f1e7]">
						<a href="/product/{product.id}" aria-label={product.name} class="block h-full w-full">
							<img
								src={product.src}
								alt={product.name}
								loading="lazy"
								class="h-full w-full object-cover"
							/>
						</a>
						{#if product.isNew}
							<span
								class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-extrabold text-white shadow"
							>
								New
							</span>
						{/if}
						<button
							type="button"
							aria-label="Remove {product.name} from comparison"
							onclick={() => shop.toggleCompare(product.id)}
							class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-500 shadow transition hover:scale-110 hover:text-red-600"
						>
							<Icon name="close" class="h-4 w-4" />
						</button>
					</div>

					<div class="flex flex-1 flex-col p-4">
						<h2 class="text-base font-bold text-ink">
							<a href="/product/{product.id}" class="hover:text-olive">{product.name}</a>
						</h2>
						<p class="mt-2 flex items-baseline gap-2">
							<span class="text-lg font-extrabold text-ink">{formatPrice(product.price)}</span>
							<span class="text-sm text-stone-400 line-through"
								>{formatPrice(product.oldPrice)}</span
							>
						</p>

						<dl class="mt-4 flex-1 space-y-2.5 border-t border-line pt-4 text-sm">
							<div class="flex items-center justify-between gap-3">
								<dt class="text-stone-500">Rating</dt>
								<dd class="flex items-center gap-1.5 font-semibold text-ink">
									<Stars rating={product.rating} class="h-3.5 w-3.5" />
									{product.rating.toFixed(1)} ({product.reviews} reviews)
								</dd>
							</div>
							<div class="flex items-center justify-between gap-3">
								<dt class="text-stone-500">Brand</dt>
								<dd class="font-semibold text-ink">{product.brand}</dd>
							</div>
							<div class="flex items-center justify-between gap-3">
								<dt class="text-stone-500">Category</dt>
								<dd class="font-semibold text-ink">{product.category}</dd>
							</div>
							<div class="flex items-center justify-between gap-3">
								<dt class="text-stone-500">Availability</dt>
								<dd class="font-semibold {stockLabel(product).cls}">{stockLabel(product).text}</dd>
							</div>
							{#each product.specs.slice(0, 3) as spec}
								<div class="flex items-start justify-between gap-3">
									<dt class="shrink-0 text-stone-500">{spec.label}</dt>
									<dd class="text-right font-medium text-ink">{spec.value}</dd>
								</div>
							{/each}
						</dl>

						<button
							type="button"
							onclick={() => addToCart(product.id)}
							disabled={product.stock <= 0}
							class="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
								? 'bg-olive-dark'
								: 'bg-olive hover:bg-olive-dark'} disabled:opacity-50"
						>
							<Icon name={added.has(product.id) ? 'check' : 'cart'} class="h-4 w-4" />
							{added.has(product.id) ? 'Added to Cart' : 'Add to Cart'}
						</button>
						<button
							type="button"
							onclick={() => shop.toggleCompare(product.id)}
							class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-stone-500 transition hover:bg-red-50 hover:text-red-600"
						>
							<Icon name="trash" class="h-4 w-4" /> Remove from comparison
						</button>
					</div>
				</article>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-stone-400">
			Prices include all taxes. Free shipping on orders over $50, free returns within 30 days.
		</p>
	{/if}
</section>
