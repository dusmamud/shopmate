<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import CheckoutSteps from '#lib/components/CheckoutSteps.svelte';
	import { getProduct } from '../../lib/data/products';
	import { shop, formatPrice, formatDate, type Order } from '../../lib/data/store.svelte';

	let order = $state<Order | undefined>(undefined);

	// The order ID comes from ?id=, which is only readable in the browser
	// (searchParams is unavailable while prerendering on the server).
	onMount(() => {
		order = shop.findOrder(page.url.searchParams.get('id') ?? '');
	});
</script>

<svelte:head>
	<title>Order Confirmed — ShopMate</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	{#if !order}
		<div class="rounded-2xl border border-line bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<Icon name="alert" class="mx-auto h-12 w-12 text-stone-300" />
			<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink">We couldn't find that order</h1>
			<p class="mt-2 text-sm text-stone-500">
				The order ID may be mistyped, or this order was placed on another device.
			</p>
			<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
				<a href="/track-order" class="rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark">Track an Order</a>
				<a href="/shop" class="rounded-lg border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive">Continue Shopping</a>
			</div>
		</div>
	{:else}
		<div class="mx-auto max-w-md"><CheckoutSteps step={3} /></div>
		<div class="mt-8 text-center">
			<span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive-soft">
				<Icon name="check-circle" class="h-11 w-11 text-olive" />
			</span>
			<h1 class="mt-5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
				Order placed successfully!
			</h1>
			<p class="mt-2 text-sm text-stone-500">
				Thank you, {order.address.name}. A confirmation has been sent to {order.email}.
			</p>
			<p class="mt-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm">
				<span class="font-medium text-stone-500">Order ID</span>
				<span class="font-mono font-bold text-ink">{order.id}</span>
			</p>
			<p class="mt-3 flex items-center justify-center gap-1.5 text-sm text-stone-600">
				<Icon name="truck" class="h-4 w-4 text-olive" />
				Estimated delivery by <span class="font-semibold text-ink">{shop.estimatedDelivery(order)}</span>
			</p>
		</div>

		<div class="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
				<h2 class="text-base font-bold text-ink">Order Summary</h2>
				<span class="text-xs text-stone-500">Placed {formatDate(order.placedAt)} · {order.payment}</span>
			</div>
			<ul class="divide-y divide-line">
				{#each order.items as item (item.id)}
					<li class="flex items-center gap-4 px-5 py-4">
						<a href="/product/{item.id}" class="block h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f6f1e7]">
							<img src={item.src} alt={item.name} class="h-full w-full object-cover" />
						</a>
						<span class="min-w-0 flex-1">
							<span class="block truncate text-sm font-semibold text-ink">{item.name}</span>
							<span class="text-xs text-stone-500">{formatPrice(item.price)} × {item.qty}{#if item.variant} · {getProduct(item.id)?.option.label ?? 'Option'}: {item.variant}{/if}</span>
						</span>
						<span class="text-sm font-bold text-ink">{formatPrice(item.price * item.qty)}</span>
					</li>
				{/each}
			</ul>
			<dl class="space-y-2 border-t border-line bg-cream/60 px-5 py-4 text-sm">
				<div class="flex justify-between">
					<dt class="text-stone-500">Subtotal</dt>
					<dd class="font-semibold text-ink">{formatPrice(order.subtotal)}</dd>
				</div>
				{#if order.discount > 0}
					<div class="flex justify-between">
						<dt class="text-stone-500">Discount</dt>
						<dd class="font-semibold text-green-700">−{formatPrice(order.discount)}</dd>
					</div>
				{/if}
				<div class="flex justify-between">
					<dt class="text-stone-500">Shipping</dt>
					<dd class="font-semibold text-ink">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</dd>
				</div>
				<div class="flex justify-between border-t border-line pt-2 text-base">
					<dt class="font-bold text-ink">Total paid</dt>
					<dd class="font-extrabold text-ink">{formatPrice(order.total)}</dd>
				</div>
			</dl>
		</div>

		<div class="mt-5 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<h2 class="flex items-center gap-2 text-base font-bold text-ink">
				<Icon name="pin" class="h-4 w-4 text-olive" /> Deliver to
			</h2>
			<address class="mt-2 text-sm leading-relaxed text-stone-600 not-italic">
				{order.address.name}<br />
				{order.address.address}, {order.address.city}, {order.address.state} {order.address.zip}<br />
				{#if order.address.phone}{order.address.phone}<br />{/if}
				{order.address.email}
			</address>
		</div>

		<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
			<a
				href="/track-order?id={order.id}"
				class="inline-flex items-center justify-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				<Icon name="package" class="h-4 w-4" /> Track Order
			</a>
			<a
				href="/shop"
				class="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive"
			>
				Continue Shopping <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{/if}
</div>
