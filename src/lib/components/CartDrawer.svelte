<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { shop, formatPrice, FREE_SHIPPING_OVER } from '../data/store.svelte';
	import { getProduct } from '../data/products';

	let closeBtn: HTMLButtonElement | undefined = $state();

	const lines = $derived(
		shop.cart
			.map((c) => ({ ...c, product: getProduct(c.id) }))
			.filter((l) => l.product !== undefined)
	);

	const remaining = $derived(Math.max(0, FREE_SHIPPING_OVER - shop.cartSubtotal));
	const progress = $derived(
		Math.min(100, (shop.cartSubtotal / FREE_SHIPPING_OVER) * 100)
	);

	// Focus the close button when the drawer opens, and lock body scroll.
	$effect(() => {
		if (!shop.drawerOpen) return;
		closeBtn?.focus();
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && shop.drawerOpen) shop.closeCart();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if shop.drawerOpen}
	<div class="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
		<!-- Backdrop -->
		<button
			type="button"
			aria-label="Close cart"
			class="absolute inset-0 cursor-default bg-black/50"
			onclick={() => shop.closeCart()}
			transition:fade={{ duration: 200 }}
		></button>

		<!-- Panel -->
		<aside
			class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
			transition:fly={{ x: 400, duration: 300 }}
		>
			<header class="flex items-center justify-between border-b border-line px-5 py-4">
				<h2 class="flex items-center gap-2 text-lg font-extrabold text-ink">
					<Icon name="cart" class="h-5 w-5" />
					Your Cart
					{#if shop.cartCount > 0}
						<span class="rounded-full bg-olive-soft px-2 py-0.5 text-xs font-bold text-olive">
							{shop.cartCount} {shop.cartCount === 1 ? 'item' : 'items'}
						</span>
					{/if}
				</h2>
				<button
					type="button"
					bind:this={closeBtn}
					aria-label="Close cart"
					onclick={() => shop.closeCart()}
					class="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream"
				>
					<Icon name="close" class="h-5 w-5" />
				</button>
			</header>

			{#if lines.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
					<div class="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-stone-400">
						<Icon name="cart" class="h-8 w-8" />
					</div>
					<p class="mt-4 text-base font-bold text-ink">Your cart is empty</p>
					<p class="mt-1 text-sm text-stone-500">Add some products and they'll show up here.</p>
					<button
						type="button"
						onclick={() => shop.closeCart()}
						class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Continue shopping <Icon name="arrow-right" class="h-4 w-4" />
					</button>
				</div>
			{:else}
				<!-- Free shipping progress -->
				<div class="border-b border-line bg-cream px-5 py-3">
					{#if remaining > 0}
						<p class="text-xs font-medium text-stone-600">
							Add <span class="font-bold text-olive">{formatPrice(remaining)}</span> more for
							<span class="font-bold text-ink"> FREE shipping</span>
						</p>
					{:else}
						<p class="flex items-center gap-1.5 text-xs font-semibold text-olive">
							<Icon name="check-circle" class="h-4 w-4" /> You've unlocked FREE shipping!
						</p>
					{/if}
					<div
						class="mt-2 h-2 overflow-hidden rounded-full bg-stone-200"
						role="progressbar"
						aria-valuenow={Math.round(progress)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="Progress towards free shipping"
					>
						<div class="h-full rounded-full bg-olive transition-all" style="width: {progress}%"></div>
					</div>
				</div>

				<!-- Lines -->
				<ul class="flex-1 space-y-4 overflow-y-auto px-5 py-4">
					{#each lines as line (line.id + (line.variant ?? ''))}
						{@const p = line.product!}
						<li class="flex gap-3">
							<a
								href="/product/{p.id}"
								onclick={() => shop.closeCart()}
								class="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f6f1e7]"
								aria-label={p.name}
							>
								<img src={p.src} srcset="{p.src.replace('.webp', '-400.webp')} 400w" sizes="80px" alt={p.name} loading="lazy" decoding="async" class="h-full w-full object-cover" />
							</a>
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-2">
									<div class="min-w-0">
										<a
											href="/product/{p.id}"
											onclick={() => shop.closeCart()}
											class="block truncate text-sm font-semibold text-ink hover:text-olive"
										>
											{p.name}
										</a>
										{#if line.variant}
											<p class="mt-0.5 text-xs text-stone-500">{p.option.label}: {line.variant}</p>
										{/if}
									</div>
									<button
										type="button"
										aria-label="Remove {p.name} from cart"
										onclick={() => shop.removeFromCart(line.id, line.variant)}
										class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600"
									>
										<Icon name="trash" class="h-4 w-4" />
									</button>
								</div>
								<div class="mt-2 flex items-center justify-between gap-2">
									<div class="flex items-center rounded-lg border border-line">
										<button
											type="button"
											aria-label="Decrease quantity of {p.name}"
											onclick={() => shop.updateQty(line.id, line.qty - 1, line.variant)}
											class="flex h-11 w-11 items-center justify-center rounded-l-lg text-ink transition hover:bg-cream disabled:opacity-40"
											disabled={line.qty <= 1}
										>
											<Icon name="minus" class="h-4 w-4" />
										</button>
										<span class="w-8 text-center text-sm font-bold text-ink" aria-live="polite">
											{line.qty}
										</span>
										<button
											type="button"
											aria-label="Increase quantity of {p.name}"
											onclick={() => shop.updateQty(line.id, line.qty + 1, line.variant)}
											class="flex h-11 w-11 items-center justify-center rounded-r-lg text-ink transition hover:bg-cream disabled:opacity-40"
											disabled={line.qty >= p.stock}
										>
											<Icon name="plus" class="h-4 w-4" />
										</button>
									</div>
									<p class="text-sm font-extrabold text-ink">{formatPrice(p.price * line.qty)}</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>

				<!-- Footer -->
				<footer class="border-t border-line px-5 py-4">
					<div class="flex items-center justify-between text-sm">
						<span class="text-stone-500">Subtotal</span>
						<span class="text-base font-extrabold text-ink">{formatPrice(shop.cartSubtotal)}</span>
					</div>
					<p class="mt-1 text-xs text-stone-500">Shipping &amp; taxes calculated at checkout.</p>
					<div class="mt-4 grid grid-cols-2 gap-3">
						<a
							href="/cart"
							onclick={() => shop.closeCart()}
							class="flex items-center justify-center rounded-lg border border-line px-4 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
						>
							View Cart
						</a>
						<a
							href="/checkout"
							onclick={() => shop.closeCart()}
							class="flex items-center justify-center gap-2 rounded-lg bg-olive px-4 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
						>
							Checkout <Icon name="arrow-right" class="h-4 w-4" />
						</a>
					</div>
				</footer>
			{/if}
		</aside>
	</div>
{/if}
