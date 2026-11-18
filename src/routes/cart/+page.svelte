<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import CheckoutSteps from '#lib/components/CheckoutSteps.svelte';
	import { getProduct, relatedProducts } from '../../lib/data/products';
	import { shop, formatPrice, FREE_SHIPPING_OVER, type CartItem } from '../../lib/data/store.svelte';

	let promoInput = $state('');
	let promoError = $state('');
	let giftInput = $state('');
	let giftError = $state('');
	let added = $state(new Set<number>());
	let removed = $state<{ item: CartItem; name: string } | null>(null);

	let undoTimer: ReturnType<typeof setTimeout> | undefined;

	const lines = $derived(
		shop.cart
			.map((c) => ({ ...c, product: getProduct(c.id) }))
			.filter((l) => l.product !== undefined)
	);

	const remaining = $derived(
		Math.max(0, FREE_SHIPPING_OVER - (shop.cartSubtotal - shop.cartDiscount))
	);
	const shipProgress = $derived(
		Math.min(100, ((shop.cartSubtotal - shop.cartDiscount) / FREE_SHIPPING_OVER) * 100)
	);

	function applyPromo() {
		promoError = '';
		if (!promoInput.trim()) return;
		if (!shop.applyPromo(promoInput)) {
			promoError = 'That promo code is not valid. Try WELCOME10 or FREESHIP.';
		} else {
			promoInput = '';
		}
	}

	function applyGiftCard() {
		giftError = '';
		if (!giftInput.trim()) return;
		if (shop.redeemGiftCard(giftInput) <= 0) {
			giftError = 'That gift card code is not valid or has no balance left.';
		} else {
			giftInput = '';
		}
	}

	function addSuggested(id: number) {
		shop.addToCart(id);
		added.add(id);
		added = new Set(added);
		setTimeout(() => {
			added.delete(id);
			added = new Set(added);
		}, 1400);
	}

	const suggestions = $derived(
		shop.cart.length > 0 ? relatedProducts(shop.cart[0].id, 4) : []
	);

	function removeLine(line: { id: number; qty: number; variant?: string; product?: { name: string } }) {
		removed = { item: { id: line.id, qty: line.qty, variant: line.variant }, name: line.product?.name ?? 'Item' };
		shop.removeFromCart(line.id, line.variant);
		clearTimeout(undoTimer);
		undoTimer = setTimeout(() => (removed = null), 6000);
	}

	function undoRemove() {
		if (!removed) return;
		shop.addToCart(removed.item.id, removed.item.qty, {
			variant: removed.item.variant,
			silent: true
		});
		removed = null;
		clearTimeout(undoTimer);
	}
</script>

<svelte:head>
	<title>Your Cart — ShopMate</title>
	<meta name="description" content="Review your ShopMate cart — free shipping over $50, 30-day returns, secure checkout." />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
		Your Cart {#if shop.cartCount > 0}<span class="font-sans text-base font-semibold text-stone-500">({shop.cartCount} {shop.cartCount === 1 ? 'item' : 'items'})</span>{/if}
	</h1>

	{#if shop.cart.length > 0}
		<div class="mt-5 max-w-2xl"><CheckoutSteps step={1} /></div>
	{/if}

	{#if removed}
		<div class="mt-5 flex items-center justify-between gap-3 rounded-xl border border-line bg-ink px-4 py-3 text-sm text-white">
			<span>Removed <strong>{removed.name}</strong> from your cart.</span>
			<button
				type="button"
				onclick={undoRemove}
				class="shrink-0 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-ink transition hover:bg-cream"
			>
				Undo
			</button>
		</div>
	{/if}

	{#if shop.cart.length === 0}
		<div class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-16 text-center">
			<Icon name="bag" class="mx-auto h-12 w-12 text-stone-300" />
			<p class="mt-4 text-lg font-bold text-ink">Your cart is empty</p>
			<p class="mt-1 text-sm text-stone-500">Browse our best sellers and add something you love.</p>
			<a
				href="/shop"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Shop Now <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<div class="mt-6 grid gap-6 lg:grid-cols-3">
			<div class="min-w-0 lg:col-span-2">
				<ul class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
					{#each lines as line (line.id + '-' + (line.variant ?? ''))}
						{@const p = line.product!}
						<li class="flex gap-4 p-4 sm:p-5">
							<a href="/product/{p.id}" class="block h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f6f1e7] sm:h-24 sm:w-24">
								<img src={p.src} srcset="{p.src.replace('.webp', '-400.webp')} 400w" sizes="(max-width: 640px) 80px, 96px" alt={p.name} loading="lazy" decoding="async" class="h-full w-full object-cover" />
							</a>
							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-3">
									<h2 class="text-sm font-semibold text-ink sm:text-base">
										<a href="/product/{p.id}" class="hover:text-olive">{p.name}</a>
									</h2>
									<button
										type="button"
										onclick={() => removeLine(line)}
										aria-label="Remove {p.name} from cart"
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-500"
									>
										<Icon name="trash" class="h-4 w-4" />
									</button>
								</div>
								{#if line.variant}
									<p class="mt-0.5 text-xs text-stone-500">{p.option.label}: {line.variant}</p>
								{/if}
								<p class="mt-0.5 text-xs text-stone-500">{formatPrice(p.price)} each</p>
								<div class="mt-3 flex items-center justify-between gap-3">
									<div class="flex items-center rounded-lg border border-line">
										<button
											type="button"
											onclick={() => shop.updateQty(p.id, line.qty - 1, line.variant)}
											aria-label="Decrease quantity of {p.name}"
											class="flex h-9 w-9 items-center justify-center text-ink transition hover:text-olive"
										>
											<Icon name="minus" class="h-4 w-4" />
										</button>
										<span class="w-8 text-center text-sm font-bold text-ink" aria-live="polite">{line.qty}</span>
										<button
											type="button"
											onclick={() => shop.updateQty(p.id, line.qty + 1, line.variant)}
											aria-label="Increase quantity of {p.name}"
											class="flex h-9 w-9 items-center justify-center text-ink transition hover:text-olive"
										>
											<Icon name="plus" class="h-4 w-4" />
										</button>
									</div>
									<p class="text-sm font-extrabold text-ink sm:text-base">
										{formatPrice(p.price * line.qty)}
									</p>
								</div>
								<button
									type="button"
									onclick={() => shop.moveLineToWishlist(line.id, line.variant)}
									class="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-stone-500 transition hover:text-olive"
								>
									<Icon name="heart" class="h-3.5 w-3.5" /> Save for later
								</button>
							</div>
						</li>
					{/each}
				</ul>

				<a href="/shop" class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark">
					<Icon name="chevron-left" class="h-4 w-4" /> Continue Shopping
				</a>
			</div>

			<aside class="min-w-0 lg:col-span-1">
				<div class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
					<h2 class="text-base font-bold text-ink">Order Summary</h2>

					<!-- Free shipping progress -->
					<div class="mt-4 rounded-xl bg-cream p-3">
						{#if remaining > 0}
							<p class="flex items-center gap-2 text-xs font-medium text-stone-600">
								<Icon name="truck" class="h-4 w-4 text-olive" />
								Add {formatPrice(remaining)} more for free shipping
							</p>
						{:else}
							<p class="flex items-center gap-2 text-xs font-semibold text-olive">
								<Icon name="check-circle" class="h-4 w-4" />
								You have unlocked free shipping!
							</p>
						{/if}
						<div class="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
							<div class="h-full rounded-full bg-olive transition-all" style="width: {shipProgress}%"></div>
						</div>
					</div>

					<!-- Promo code -->
					{#if shop.promoCode}
						<div class="mt-4 flex items-center justify-between rounded-lg border border-olive/30 bg-olive-soft px-3 py-2.5">
							<span class="flex items-center gap-2 text-sm font-semibold text-olive">
								<Icon name="tag" class="h-4 w-4" /> {shop.promoCode} applied
							</span>
							<button
								type="button"
								onclick={() => shop.clearPromo()}
								class="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-500"
							>
								<Icon name="close" class="h-3.5 w-3.5" /> Remove
							</button>
						</div>
					{:else}
						<form
							class="mt-4"
							onsubmit={(e) => {
								e.preventDefault();
								applyPromo();
							}}
						>
							<label for="promo" class="text-xs font-semibold text-stone-500">Promo code</label>
							<div class="mt-1.5 flex gap-2">
								<input
									id="promo"
									type="text"
									bind:value={promoInput}
									placeholder="WELCOME10"
									autocomplete="off"
									class="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 text-sm uppercase placeholder:normal-case focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
								/>
								<button
									type="submit"
									class="shrink-0 rounded-lg border border-olive px-4 py-2.5 text-sm font-semibold text-olive transition hover:bg-olive-soft"
								>
									Apply
								</button>
							</div>
							{#if promoError}
								<p class="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
									<Icon name="alert" class="h-3.5 w-3.5" /> {promoError}
								</p>
							{:else}
								<p class="mt-1.5 text-xs text-stone-500">Try WELCOME10 for 10% off or FREESHIP.</p>
							{/if}
						</form>
					{/if}

					<!-- Gift card -->
					{#if shop.giftCardCredit > 0}
						<div class="mt-4 flex items-center justify-between rounded-lg border border-olive/30 bg-olive-soft px-3 py-2.5">
							<span class="flex items-center gap-2 text-sm font-semibold text-olive">
								<Icon name="tag" class="h-4 w-4" /> Gift card −{formatPrice(shop.giftCardCredit)}
							</span>
							<button
								type="button"
								onclick={() => shop.clearGiftCardCredit()}
								class="flex items-center gap-1 text-xs font-medium text-stone-500 hover:text-red-500"
							>
								<Icon name="close" class="h-3.5 w-3.5" /> Remove
							</button>
						</div>
					{:else}
						<form
							class="mt-4"
							onsubmit={(e) => {
								e.preventDefault();
								applyGiftCard();
							}}
						>
							<label for="giftcard" class="text-xs font-semibold text-stone-500">Gift card</label>
							<div class="mt-1.5 flex gap-2">
								<input
									id="giftcard"
									type="text"
									bind:value={giftInput}
									placeholder="SMGC-XXXXXX"
									autocomplete="off"
									class="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 font-mono text-sm uppercase placeholder:normal-case focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
								/>
								<button
									type="submit"
									class="shrink-0 rounded-lg border border-olive px-4 py-2.5 text-sm font-semibold text-olive transition hover:bg-olive-soft"
								>
									Apply
								</button>
							</div>
							{#if giftError}
								<p class="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
									<Icon name="alert" class="h-3.5 w-3.5" /> {giftError}
								</p>
							{:else}
								<p class="mt-1.5 text-xs text-stone-500">Enter a gift card code from your account.</p>
							{/if}
						</form>
					{/if}

					<dl class="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
						<div class="flex justify-between">
							<dt class="text-stone-500">Subtotal</dt>
							<dd class="font-semibold text-ink">{formatPrice(shop.cartSubtotal)}</dd>
						</div>
						{#if shop.cartDiscount > 0}
							<div class="flex justify-between">
								<dt class="text-stone-500">Discount</dt>
								<dd class="font-semibold text-green-700">−{formatPrice(shop.cartDiscount)}</dd>
							</div>
						{/if}
						{#if shop.giftCardCredit > 0}
							<div class="flex justify-between">
								<dt class="text-stone-500">Gift card credit</dt>
								<dd class="font-semibold text-green-700">−{formatPrice(shop.giftCardCredit)}</dd>
							</div>
						{/if}
						<div class="flex justify-between">
							<dt class="text-stone-500">Shipping</dt>
							<dd class="font-semibold text-ink">
								{shop.cartShipping === 0 ? 'FREE' : formatPrice(shop.cartShipping)}
							</dd>
						</div>
						<div class="flex justify-between">
							<dt class="flex items-center gap-1.5 text-stone-500">
								<Icon name="truck" class="h-4 w-4 text-olive" /> Estimated delivery
							</dt>
							<dd class="font-semibold text-ink">
								{new Date(Date.now() + 4 * 24 * 3_600_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							</dd>
						</div>
						<div class="flex justify-between border-t border-line pt-3 text-base">
							<dt class="font-bold text-ink">Total</dt>
							<dd class="font-extrabold text-ink">{formatPrice(shop.cartTotal)}</dd>
						</div>
					</dl>

					<button
						type="button"
						onclick={() => goto('/checkout')}
						class="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Proceed to Checkout <Icon name="arrow-right" class="h-4 w-4" />
					</button>
					<p class="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-500">
						<Icon name="shield" class="h-3.5 w-3.5" /> Secure checkout · 30-day returns
					</p>
				</div>
			</aside>
		</div>

		{#if suggestions.length > 0}
			<section class="mt-12" aria-label="You may also like">
				<h2 class="text-lg font-extrabold tracking-tight text-ink sm:text-xl">You may also like</h2>
				<div class="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{#each suggestions as product, i (product.id)}
						<article style="--i: {i}" class="card-in group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
							<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
								<a href="/product/{product.id}" aria-label={product.name} class="block h-full w-full">
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
								</a>
								{#if product.isNew}
									<span class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase shadow">
										New
									</span>
								{/if}
							</div>
							<div class="flex flex-1 flex-col p-3 sm:p-4">
								<h3 class="text-sm font-semibold text-ink">
									<a href="/product/{product.id}" class="hover:text-olive">{product.name}</a>
								</h3>
								<p class="mt-2 flex items-baseline gap-2">
									<span class="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
									<span class="text-xs text-stone-500 line-through">{formatPrice(product.oldPrice)}</span>
								</p>
								<button
									type="button"
									onclick={() => addSuggested(product.id)}
									class="press mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
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
			</section>
		{/if}
	{/if}
</div>
