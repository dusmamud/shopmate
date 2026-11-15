<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import { getProduct } from '../../lib/data/products';
	import { shop, formatPrice, type Address } from '../../lib/data/store.svelte';

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

	let errors = $state<Record<string, string>>({});
	let placing = $state(false);

	const lines = $derived(
		shop.cart
			.map((c) => ({ ...c, product: getProduct(c.id) }))
			.filter((l) => l.product !== undefined)
	);

	onMount(() => {
		if (shop.cart.length === 0) goto('/cart');
	});

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
		const order = shop.placeOrder(addr, label);
		if (order) goto('/order-success?id=' + order.id);
		else goto('/cart');
	}

	const inputCls =
		'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none';
</script>

<svelte:head>
	<title>Checkout — ShopMate</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Checkout</h1>

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
			<div class="space-y-6 lg:col-span-2">
				<!-- 1. Contact & shipping -->
				<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
					<h2 class="flex items-center gap-2.5 text-base font-bold text-ink">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-xs font-bold text-white">1</span>
						Contact &amp; Shipping
					</h2>
					{#if !shop.user}
						<p class="mt-3 rounded-lg bg-cream px-3.5 py-2.5 text-sm text-stone-600">
							Returning customer?
							<a href="/login" class="font-semibold text-olive hover:text-olive-dark">Log in</a>
							for faster checkout.
						</p>
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
							<label for="phone" class="text-xs font-semibold text-stone-500">Phone <span class="font-normal text-stone-400">(optional)</span></label>
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
				</section>

				<!-- 2. Payment -->
				<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
					<h2 class="flex items-center gap-2.5 text-base font-bold text-ink">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-xs font-bold text-white">2</span>
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

				<div class="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-cream px-5 py-4 text-xs font-medium text-stone-600 sm:gap-6">
					<span class="flex items-center gap-1.5"><Icon name="shield" class="h-4 w-4 text-olive" /> Secure checkout</span>
					<span class="flex items-center gap-1.5"><Icon name="truck" class="h-4 w-4 text-olive" /> Fast delivery</span>
					<span class="flex items-center gap-1.5"><Icon name="returns" class="h-4 w-4 text-olive" /> 30-day returns</span>
				</div>
			</div>

			<!-- Order summary -->
			<aside class="lg:col-span-1">
				<div class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
					<h2 class="text-base font-bold text-ink">Order Summary</h2>
					<ul class="mt-4 space-y-3">
						{#each lines as line (line.id)}
							{@const p = line.product!}
							<li class="flex items-center gap-3">
								<span class="relative block h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f6f1e7]">
									<img src={p.src} alt={p.name} class="h-full w-full object-cover" />
									<span class="absolute -top-0 -right-0 flex h-5 w-5 items-center justify-center rounded-full bg-olive text-[10px] font-bold text-white">{line.qty}</span>
								</span>
								<span class="min-w-0 flex-1">
									<span class="block truncate text-sm font-semibold text-ink">{p.name}</span>
									<span class="text-xs text-stone-500">{formatPrice(p.price)} × {line.qty}</span>
								</span>
								<span class="text-sm font-semibold text-ink">{formatPrice(p.price * line.qty)}</span>
							</li>
						{/each}
					</ul>
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
						<div class="flex justify-between border-t border-line pt-3 text-base">
							<dt class="font-bold text-ink">Total</dt>
							<dd class="font-extrabold text-ink">{formatPrice(shop.cartTotal)}</dd>
						</div>
					</dl>
					<button
						type="submit"
						disabled={placing}
						class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-olive-dark disabled:opacity-60"
					>
						<Icon name="lock" class="h-4 w-4" />
						{placing ? 'Placing Order…' : `Place Order · ${formatPrice(shop.cartTotal)}`}
					</button>
					<p class="mt-3 text-center text-xs text-stone-400">
						By placing this order you agree to our Terms and Privacy Policy.
					</p>
				</div>
			</aside>
		</form>
	{/if}
</div>
