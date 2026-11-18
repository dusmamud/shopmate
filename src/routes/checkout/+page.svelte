<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import CheckoutSteps from '#lib/components/CheckoutSteps.svelte';
	import { getProduct } from '../../lib/data/products';
	import { shop, formatPrice, GIFT_WRAP_FEE, type Address, type SavedAddress } from '../../lib/data/store.svelte';

	type PaymentMethod = 'cod' | 'card' | 'upi';

	let name = $state(shop.user?.name ?? '');
	let email = $state(shop.user?.email ?? '');
	let phone = $state('');
	let address = $state('');
	let city = $state('');
	let stateName = $state('');
	let zip = $state('');

	let payment = $state<PaymentMethod>('cod');
	let cardNumber = $state('');
	let cardExpiry = $state('');
	let cardCvc = $state('');
	let upiId = $state('');

	// Delivery extras
	let notes = $state('');
	let giftWrap = $state(false);
	let promoInput = $state('');
	let promoError = $state('');

	// Saved addresses (logged-in users)
	let selectedAddressId = $state<string | null>(null);
	let saveAddress = $state(false);

	const orderTotal = $derived(shop.cartTotal + (giftWrap ? GIFT_WRAP_FEE : 0));

	let errors = $state<Record<string, string>>({});
	let placing = $state(false);

	const lines = $derived(
		shop.cart
			.map((c) => ({ ...c, product: getProduct(c.id) }))
			.filter((l) => l.product !== undefined)
	);

	onMount(() => {
		if (shop.cart.length === 0) goto('/cart');
		const def = shop.user ? shop.defaultAddress : undefined;
		if (def) {
			selectedAddressId = def.id;
			applyAddress(def);
		}
	});

	function applyAddress(a: SavedAddress) {
		name = a.name;
		email = a.email;
		phone = a.phone;
		address = a.address;
		city = a.city;
		stateName = a.state;
		zip = a.zip;
	}

	function pickAddress(id: string | null) {
		selectedAddressId = id;
		if (!id) return;
		const found = shop.addresses.find((a) => a.id === id);
		if (found) applyAddress(found);
	}

	function formatCardNumber(value: string) {
		const digits = value.replace(/\D/g, '').slice(0, 16);
		cardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
	}

	function formatExpiry(value: string) {
		const digits = value.replace(/\D/g, '').slice(0, 4);
		if (digits.length > 2) cardExpiry = digits.slice(0, 2) + '/' + digits.slice(2);
		else cardExpiry = digits;
	}

	function validate(): boolean {
		const errs: Record<string, string> = {};
		if (!name.trim()) errs.name = 'Full name is required.';
		if (!email.trim()) errs.email = 'Email is required.';
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
			errs.email = 'Enter a valid email address.';
		if (phone.trim() && phone.replace(/\D/g, '').length < 8)
			errs.phone = 'Enter a valid phone number.';
		if (!address.trim()) errs.address = 'Street address is required.';
		if (!city.trim()) errs.city = 'City is required.';
		if (!stateName.trim()) errs.state = 'State is required.';
		if (!zip.trim()) errs.zip = 'ZIP code is required.';
		else if (zip.trim().length < 3) errs.zip = 'Enter a valid ZIP code.';

		if (payment === 'card') {
			const digits = cardNumber.replace(/\D/g, '');
			if (digits.length !== 16) errs.cardNumber = 'Enter a valid 16-digit card number.';
			if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry))
				errs.cardExpiry = 'Use MM/YY format.';
			if (!/^\d{3}$/.test(cardCvc)) errs.cardCvc = 'Enter the 3-digit CVC.';
		}
		if (payment === 'upi') {
			if (!upiId.trim()) errs.upi = 'UPI ID is required.';
			else if (!upiId.trim().includes('@')) errs.upi = 'Enter a valid UPI ID, e.g. name@okhdfcbank.';
		}

		errors = errs;
		return Object.keys(errs).length === 0;
	}

	function placeOrder() {
		if (placing) return;
		if (!validate()) {
			const first = document.querySelector('[data-error="true"]');
			first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		placing = true;
		const addr: Address = {
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
			address: address.trim(),
			city: city.trim(),
			state: stateName.trim(),
			zip: zip.trim()
		};
		const label =
			payment === 'cod'
				? 'Cash on Delivery'
				: payment === 'card'
					? 'Card (•••• ' + cardNumber.replace(/\D/g, '').slice(-4) + ')'
					: 'UPI (' + upiId.trim() + ')';
		const order = shop.placeOrder(addr, label, { notes, giftWrap });
		if (order) {
			if (shop.user && saveAddress) {
				const exists = shop.addresses.some(
					(a) => a.address.trim().toLowerCase() === addr.address.toLowerCase() && a.zip === addr.zip
				);
				if (!exists) {
					shop.addAddress({ ...addr, label: addr.city || 'My address' });
				}
			}
			goto('/order-success?id=' + order.id);
		} else goto('/cart');
	}

	function applyPromo() {
		promoError = '';
		if (!promoInput.trim()) return;
		if (!shop.applyPromo(promoInput)) {
			promoError = 'That promo code is not valid. Try WELCOME10 or FREESHIP.';
		} else {
			promoInput = '';
		}
	}

	const inputCls =
		'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none';
</script>

<svelte:head>
	<title>Secure Checkout — ShopMate | Cash on Delivery, Card &amp; UPI</title>
	<meta name="description" content="Secure checkout at ShopMate — cash on delivery, card and UPI accepted. Free shipping over $50." />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Checkout</h1>
	<div class="mt-5"><CheckoutSteps step={2} /></div>

	{#if shop.cart.length === 0}
		<p class="mt-6 text-sm text-stone-500">Your cart is empty. Redirecting…</p>
	{:else}
		<form
			class="mt-6 grid gap-6 lg:grid-cols-3"
			onsubmit={(e) => {
				e.preventDefault();
				placeOrder();
			}}
			novalidate
		>
			<div class="min-w-0 space-y-6 lg:col-span-2">
				<!-- 1. Contact & shipping -->
				<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
					<h2 class="flex items-center gap-2.5 text-base font-bold text-ink">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-olive font-sans text-xs font-bold text-white">1</span>
						Contact &amp; Shipping
					</h2>
					{#if !shop.user}
						<p class="mt-3 rounded-lg bg-cream px-3.5 py-2.5 text-sm text-stone-600">
							Already have an account?
							<a href="/login?redirect=/checkout" class="font-semibold text-olive hover:text-olive-dark">Log in</a>
							for faster checkout.
						</p>
					{/if}
					{#if shop.user && shop.addresses.length > 0}
						<div class="mt-4">
							<p class="text-xs font-semibold text-stone-500">Deliver to a saved address</p>
							<div class="mt-2 grid gap-2 sm:grid-cols-2">
								{#each shop.addresses as saved (saved.id)}
									<button
										type="button"
										onclick={() => pickAddress(saved.id)}
										aria-pressed={selectedAddressId === saved.id}
										class="rounded-xl border p-3.5 text-left transition {selectedAddressId === saved.id
											? 'border-olive bg-olive-soft/50'
											: 'border-line hover:border-olive/50'}"
									>
										<span class="flex items-center gap-2 text-sm font-semibold text-ink">
											<Icon name="pin" class="h-4 w-4 text-olive" /> {saved.label}
											{#if saved.isDefault}
												<span class="rounded-full bg-olive px-2 py-0.5 text-[10px] font-bold text-white">Default</span>
											{/if}
										</span>
										<span class="mt-1 block text-xs leading-relaxed text-stone-500">
											{saved.name} · {saved.address}, {saved.city}, {saved.state} {saved.zip}
										</span>
									</button>
								{/each}
								<button
									type="button"
									onclick={() => pickAddress(null)}
									aria-pressed={selectedAddressId === null}
									class="rounded-xl border border-dashed p-3.5 text-left transition {selectedAddressId ===
									null
										? 'border-olive bg-olive-soft/50'
										: 'border-line hover:border-olive/50'}"
								>
									<span class="text-sm font-semibold text-ink">Use a different address</span>
									<span class="mt-1 block text-xs text-stone-500">Fill in the form below.</span>
								</button>
							</div>
						</div>
					{/if}
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						<div data-error={!!errors.name}>
							<label for="name" class="text-xs font-semibold text-stone-500">Full name *</label>
							<input id="name" type="text" bind:value={name} placeholder="John Doe" autocomplete="name" class="{inputCls} mt-1.5 {errors.name ? 'border-red-400' : ''}" />
							{#if errors.name}<p class="mt-1 text-xs text-red-600">{errors.name}</p>{/if}
						</div>
						<div data-error={!!errors.email}>
							<label for="email" class="text-xs font-semibold text-stone-500">Email *</label>
							<input id="email" type="email" bind:value={email} placeholder="john@example.com" autocomplete="email" class="{inputCls} mt-1.5 {errors.email ? 'border-red-400' : ''}" />
							{#if errors.email}<p class="mt-1 text-xs text-red-600">{errors.email}</p>{/if}
						</div>
						<div data-error={!!errors.phone}>
							<label for="phone" class="text-xs font-semibold text-stone-500">Phone <span class="font-normal text-stone-500">(optional)</span></label>
							<input id="phone" type="tel" bind:value={phone} placeholder="+1 555 010 1234" autocomplete="tel" class="{inputCls} mt-1.5 {errors.phone ? 'border-red-400' : ''}" />
							{#if errors.phone}<p class="mt-1 text-xs text-red-600">{errors.phone}</p>{/if}
						</div>
						<div data-error={!!errors.zip}>
							<label for="zip" class="text-xs font-semibold text-stone-500">ZIP code *</label>
							<input id="zip" type="text" bind:value={zip} placeholder="10001" autocomplete="postal-code" inputmode="numeric" class="{inputCls} mt-1.5 {errors.zip ? 'border-red-400' : ''}" />
							{#if errors.zip}<p class="mt-1 text-xs text-red-600">{errors.zip}</p>{/if}
						</div>
						<div class="sm:col-span-2" data-error={!!errors.address}>
							<label for="address" class="text-xs font-semibold text-stone-500">Street address *</label>
							<input id="address" type="text" bind:value={address} placeholder="123 Main Street, Apt 4" autocomplete="street-address" class="{inputCls} mt-1.5 {errors.address ? 'border-red-400' : ''}" />
							{#if errors.address}<p class="mt-1 text-xs text-red-600">{errors.address}</p>{/if}
						</div>
						<div data-error={!!errors.city}>
							<label for="city" class="text-xs font-semibold text-stone-500">City *</label>
							<input id="city" type="text" bind:value={city} placeholder="New York" autocomplete="address-level2" class="{inputCls} mt-1.5 {errors.city ? 'border-red-400' : ''}" />
							{#if errors.city}<p class="mt-1 text-xs text-red-600">{errors.city}</p>{/if}
						</div>
						<div data-error={!!errors.state}>
							<label for="state" class="text-xs font-semibold text-stone-500">State *</label>
							<input id="state" type="text" bind:value={stateName} placeholder="NY" autocomplete="address-level1" class="{inputCls} mt-1.5 {errors.state ? 'border-red-400' : ''}" />
							{#if errors.state}<p class="mt-1 text-xs text-red-600">{errors.state}</p>{/if}
						</div>
					</div>
					{#if shop.user}
						<label class="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-stone-600">
							<input type="checkbox" bind:checked={saveAddress} class="h-4 w-4 accent-[#5c7038]" />
							Save this address to my account for next time
						</label>
					{/if}
				</section>

				<!-- 2. Payment -->
				<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
					<h2 class="flex items-center gap-2.5 text-base font-bold text-ink">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-olive font-sans text-xs font-bold text-white">2</span>
						Payment Method
					</h2>
					<div class="mt-4 space-y-3" role="radiogroup" aria-label="Payment method">
						<label class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition {payment === 'cod' ? 'border-olive bg-olive-soft/50' : 'border-line hover:border-olive/50'}">
							<input type="radio" name="payment" value="cod" bind:group={payment} class="mt-1 accent-[#5c7038]" />
							<span>
								<span class="block text-sm font-semibold text-ink">Cash on Delivery</span>
								<span class="mt-0.5 block text-xs text-stone-500">Pay in cash when your order arrives.</span>
							</span>
						</label>
						<label class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition {payment === 'card' ? 'border-olive bg-olive-soft/50' : 'border-line hover:border-olive/50'}">
							<input type="radio" name="payment" value="card" bind:group={payment} class="mt-1 accent-[#5c7038]" />
							<span class="flex-1">
								<span class="flex items-center gap-2 text-sm font-semibold text-ink">
									<Icon name="credit-card" class="h-4 w-4 text-olive" /> Card
								</span>
								<span class="mt-0.5 block text-xs text-stone-500">Visa, Mastercard, RuPay and more.</span>
								{#if payment === 'card'}
									<span class="mt-3 grid gap-3 sm:grid-cols-2">
										<span class="sm:col-span-2" data-error={!!errors.cardNumber}>
											<label for="cardNumber" class="text-xs font-semibold text-stone-500">Card number *</label>
											<input
												id="cardNumber"
												type="text"
												value={cardNumber}
												oninput={(e) => formatCardNumber(e.currentTarget.value)}
												placeholder="4242 4242 4242 4242"
												inputmode="numeric"
												autocomplete="cc-number"
												class="{inputCls} mt-1.5 {errors.cardNumber ? 'border-red-400' : ''}"
											/>
											{#if errors.cardNumber}<span class="mt-1 block text-xs text-red-600">{errors.cardNumber}</span>{/if}
										</span>
										<span data-error={!!errors.cardExpiry}>
											<label for="cardExpiry" class="text-xs font-semibold text-stone-500">Expiry (MM/YY) *</label>
											<input
												id="cardExpiry"
												type="text"
												value={cardExpiry}
												oninput={(e) => formatExpiry(e.currentTarget.value)}
												placeholder="08/28"
												inputmode="numeric"
												autocomplete="cc-exp"
												class="{inputCls} mt-1.5 {errors.cardExpiry ? 'border-red-400' : ''}"
											/>
											{#if errors.cardExpiry}<span class="mt-1 block text-xs text-red-600">{errors.cardExpiry}</span>{/if}
										</span>
										<span data-error={!!errors.cardCvc}>
											<label for="cardCvc" class="text-xs font-semibold text-stone-500">CVC *</label>
											<input
												id="cardCvc"
												type="text"
												value={cardCvc}
												oninput={(e) => (cardCvc = e.currentTarget.value.replace(/\D/g, '').slice(0, 3))}
												placeholder="123"
												inputmode="numeric"
												autocomplete="cc-csc"
												class="{inputCls} mt-1.5 {errors.cardCvc ? 'border-red-400' : ''}"
											/>
											{#if errors.cardCvc}<span class="mt-1 block text-xs text-red-600">{errors.cardCvc}</span>{/if}
										</span>
									</span>
								{/if}
							</span>
						</label>
						<label class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition {payment === 'upi' ? 'border-olive bg-olive-soft/50' : 'border-line hover:border-olive/50'}">
							<input type="radio" name="payment" value="upi" bind:group={payment} class="mt-1 accent-[#5c7038]" />
							<span class="flex-1">
								<span class="block text-sm font-semibold text-ink">UPI</span>
								<span class="mt-0.5 block text-xs text-stone-500">Pay instantly with Google Pay, PhonePe or Paytm.</span>
								{#if payment === 'upi'}
									<span class="mt-3 block" data-error={!!errors.upi}>
										<label for="upiId" class="text-xs font-semibold text-stone-500">UPI ID *</label>
										<input
											id="upiId"
											type="text"
											bind:value={upiId}
											placeholder="name@okhdfcbank"
											autocomplete="off"
											class="{inputCls} mt-1.5 {errors.upi ? 'border-red-400' : ''}"
										/>
										{#if errors.upi}<span class="mt-1 block text-xs text-red-600">{errors.upi}</span>{/if}
									</span>
								{/if}
							</span>
						</label>
					</div>
				</section>

				<!-- 3. Delivery & gifting -->
				<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
					<h2 class="flex items-center gap-2.5 text-base font-bold text-ink">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-olive font-sans text-xs font-bold text-white">3</span>
						Delivery &amp; Gifting
					</h2>
					<div class="mt-4">
						<label for="notes" class="text-xs font-semibold text-stone-500">Delivery instructions <span class="font-normal text-stone-500">(optional)</span></label>
						<textarea
							id="notes"
							bind:value={notes}
							rows="2"
							maxlength="200"
							placeholder="e.g. Leave the parcel with the security guard"
							class="{inputCls} mt-1.5 resize-y"
						></textarea>
					</div>
					<label class="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition hover:border-olive/50">
						<input type="checkbox" bind:checked={giftWrap} class="mt-0.5 h-4 w-4 accent-[#5c7038]" />
						<span>
							<span class="block text-sm font-semibold text-ink">Add gift wrap — {formatPrice(GIFT_WRAP_FEE)}</span>
							<span class="mt-0.5 block text-xs text-stone-500">Wrapped in kraft paper with a ribbon and a blank gift note. Prices are hidden from the packing slip.</span>
						</span>
					</label>
				</section>

				<div class="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-cream px-5 py-4 text-xs font-medium text-stone-600 sm:gap-6">
					<span class="flex items-center gap-1.5"><Icon name="shield" class="h-4 w-4 text-olive" /> Secure checkout</span>
					<span class="flex items-center gap-1.5"><Icon name="truck" class="h-4 w-4 text-olive" /> Fast delivery</span>
					<span class="flex items-center gap-1.5"><Icon name="returns" class="h-4 w-4 text-olive" /> 30-day returns</span>
				</div>
			</div>

			<!-- Order summary -->
			<aside class="min-w-0 lg:col-span-1">
				<div class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
					<h2 class="text-base font-bold text-ink">Order Summary</h2>
					<ul class="mt-4 space-y-3">
						{#each lines as line (line.id + '-' + (line.variant ?? ''))}
							{@const p = line.product!}
							<li class="flex items-center gap-3">
								<span class="relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f6f1e7]">
									<img src={p.src} srcset="{p.src.replace('.webp', '-400.webp')} 400w" sizes="56px" alt={p.name} loading="lazy" decoding="async" class="h-full w-full object-cover" />
									<span class="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-olive text-[10px] font-bold text-white">{line.qty}</span>
								</span>
								<span class="min-w-0 flex-1">
									<span class="block truncate text-sm font-semibold text-ink">{p.name}</span>
									<span class="text-xs text-stone-500">{formatPrice(p.price)} × {line.qty}{#if line.variant} · {p.option.label}: {line.variant}{/if}</span>
								</span>
								<span class="text-sm font-semibold text-ink">{formatPrice(p.price * line.qty)}</span>
							</li>
						{/each}
					</ul>

					<!-- Promo code at checkout -->
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
						<div class="mt-4">
							<label for="checkout-promo" class="text-xs font-semibold text-stone-500">Promo code</label>
							<div class="mt-1.5 flex gap-2">
								<input
									id="checkout-promo"
									type="text"
									bind:value={promoInput}
									placeholder="WELCOME10"
									autocomplete="off"
									class="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 text-sm uppercase placeholder:normal-case focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
								/>
								<button
									type="button"
									onclick={applyPromo}
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
						</div>
					{/if}

					<dl class="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
						<div class="flex justify-between">
							<dt class="text-stone-500">Subtotal</dt>
							<dd class="font-semibold text-ink">{formatPrice(shop.cartSubtotal)}</dd>
						</div>
						{#if shop.cartDiscount > 0}
							<div class="flex justify-between">
								<dt class="text-stone-500">Discount{#if shop.promoCode} ({shop.promoCode}){/if}</dt>
								<dd class="font-semibold text-green-700">−{formatPrice(shop.cartDiscount)}</dd>
							</div>
						{/if}
						<div class="flex justify-between">
							<dt class="text-stone-500">Shipping</dt>
							<dd class="font-semibold text-ink">{shop.cartShipping === 0 ? 'FREE' : formatPrice(shop.cartShipping)}</dd>
						</div>
						{#if giftWrap}
							<div class="flex justify-between">
								<dt class="text-stone-500">Gift wrap</dt>
								<dd class="font-semibold text-ink">{formatPrice(GIFT_WRAP_FEE)}</dd>
							</div>
						{/if}
						<div class="flex justify-between border-t border-line pt-3 text-base">
							<dt class="font-bold text-ink">Total</dt>
							<dd class="font-extrabold text-ink">{formatPrice(orderTotal)}</dd>
						</div>
					</dl>
					<button
						type="submit"
						disabled={placing}
						class="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-olive-dark disabled:opacity-60"
					>
						<Icon name="lock" class="h-4 w-4" />
						{placing ? 'Placing Order…' : `Place Order · ${formatPrice(orderTotal)}`}
					</button>
					<p class="mt-3 text-center text-xs text-stone-500">
						By placing this order you agree to our
						<a href="/terms" class="font-medium text-olive hover:underline">Terms</a>
						and
						<a href="/privacy-policy" class="font-medium text-olive hover:underline">Privacy Policy</a>.
					</p>
				</div>
			</aside>
		</form>
	{/if}
</div>
