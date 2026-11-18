<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import Stars from './Stars.svelte';
	import { shop, formatPrice } from '../data/store.svelte';
	import { getProduct } from '../data/products';

	let closeBtn: HTMLButtonElement | undefined = $state();

	const product = $derived(shop.quickViewId ? getProduct(shop.quickViewId) : undefined);

	// Focus the close button when the modal opens, and lock body scroll.
	$effect(() => {
		if (!product) return;
		closeBtn?.focus();
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && shop.quickViewId !== null) shop.closeQuickView();
	}

	function addToCart() {
		if (!product) return;
		// Capture the id first: closing the quick view clears quickViewId,
		// which makes the `product` derived undefined before addToCart runs.
		const id = product.id;
		shop.closeQuickView();
		// Default behaviour: adding opens the cart drawer as confirmation.
		shop.addToCart(id);
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if product}
	<div
		class="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Quick view: {product.name}"
	>
		<!-- Backdrop -->
		<button
			type="button"
			aria-label="Close quick view"
			class="absolute inset-0 cursor-default bg-black/50"
			onclick={() => shop.closeQuickView()}
			transition:fade={{ duration: 200 }}
		></button>

		<!-- Panel: bottom sheet on mobile, centered dialog on desktop -->
		<div
			class="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
		>
			<!-- Grab handle (mobile only) -->
			<div class="mx-auto mt-3 h-1.5 w-12 rounded-full bg-stone-200 sm:hidden" aria-hidden="true"></div>

			<button
				type="button"
				bind:this={closeBtn}
				aria-label="Close quick view"
				onclick={() => shop.closeQuickView()}
				class="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow transition hover:bg-cream"
			>
				<Icon name="close" class="h-5 w-5" />
			</button>

			<div class="grid sm:grid-cols-2">
				<div class="aspect-square overflow-hidden bg-[#f6f1e7] sm:rounded-l-3xl">
					<img
						src={product.src}
						srcset={product.src.includes('backpack') || product.src.includes('headphones')
							? `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src.replace('.webp', '-1200.webp')} 1200w, ${product.src} 1600w`
							: `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src} ${product.src.includes('lamp') || product.src.includes('tshirt') ? 1120 : 912}w`}
						sizes="(max-width: 640px) 100vw, 384px"
						alt={product.name}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="flex flex-col p-5 sm:p-6">
					<p class="text-xs font-semibold tracking-wider text-olive uppercase">{product.category}</p>
					<h2 class="mt-1.5 text-xl font-extrabold tracking-tight text-ink">{product.name}</h2>
					<p class="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
						<Stars rating={product.rating} class="h-4 w-4" />
						<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
						<span>({product.reviews} reviews)</span>
					</p>
					<p class="mt-3 flex items-baseline gap-2">
						<span class="text-2xl font-extrabold text-ink">{formatPrice(product.price)}</span>
						<span class="text-sm text-stone-500 line-through">{formatPrice(product.oldPrice)}</span>
						<span class="rounded-full bg-olive-soft px-2 py-0.5 text-xs font-bold text-olive">
							{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% off
						</span>
					</p>
					<p class="mt-3 text-sm leading-relaxed text-stone-600">{product.desc}</p>
					<p class="mt-3 flex items-center gap-1.5 text-xs font-medium text-stone-500">
						<Icon name="check-circle" class="h-4 w-4 text-olive" />
						{#if product.stock > 0}
							In stock — only {product.stock} left
						{:else}
							Currently out of stock
						{/if}
					</p>

					<div class="mt-5 flex flex-col gap-2.5 sm:flex-row">
						<button
							type="button"
							onclick={addToCart}
							disabled={product.stock <= 0}
							class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-olive-dark disabled:opacity-60"
						>
							<Icon name="cart" class="h-4 w-4" /> Add to Cart
						</button>
						<a
							href="/product/{product.id}"
							onclick={() => shop.closeQuickView()}
							class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
						>
							View full details <Icon name="arrow-right" class="h-4 w-4" />
						</a>
					</div>

					<div class="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
						<span class="flex items-center gap-1.5">
							<Icon name="truck" class="h-4 w-4 text-olive" /> Free shipping over $50
						</span>
						<span class="flex items-center gap-1.5">
							<Icon name="returns" class="h-4 w-4 text-olive" /> 30-day returns
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
