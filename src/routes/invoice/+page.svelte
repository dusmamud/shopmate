<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { getProduct } from '../../lib/data/products';
	import { shop, formatPrice, formatDate, type Order } from '../../lib/data/store.svelte';

	let order = $state<Order | undefined>(undefined);

	// The order ID comes from ?order=, which is only readable in the browser
	// (searchParams is unavailable while prerendering on the server).
	onMount(() => {
		order = shop.findOrder(page.url.searchParams.get('order') ?? '');
	});

	function printInvoice() {
		window.print();
	}
</script>

<svelte:head>
	<title>Tax Invoice — ShopMate</title>
	<meta
		name="description"
		content="Your ShopMate tax invoice — billed items, payment method, delivery details and estimated delivery, with prices including all taxes. Print or save as PDF."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
	{#if !order}
		<div class="rounded-2xl border border-line bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<Icon name="alert" class="mx-auto h-12 w-12 text-stone-300" />
			<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink">Order not found</h1>
			<p class="mt-2 text-sm text-stone-500">
				We couldn't find an order for this invoice. It may have been placed on another device.
			</p>
			<a
				href="/track-order"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Track an Order <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<div class="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
			<a href="/track-order?id={order.id}" class="inline-flex items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark">
				<Icon name="chevron-left" class="h-4 w-4" /> Back to tracking
			</a>
			<button
				type="button"
				onclick={printInvoice}
				class="press inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				<Icon name="package" class="h-4 w-4" /> Print / Save as PDF
			</button>
		</div>

		<div class="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<div class="flex flex-wrap items-start justify-between gap-4 border-b border-line bg-cream/60 px-6 py-6">
				<div>
					<p class="flex items-center gap-2 text-xl font-extrabold tracking-tight text-ink">
						<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-olive text-white">
							<Icon name="bag" class="h-5 w-5" />
						</span>
						ShopMate
					</p>
					<h1 class="mt-3 text-lg font-extrabold text-ink">Tax Invoice</h1>
					<p class="text-sm text-stone-500">hello@shopmate.store · Demo store — no real payment taken</p>
				</div>
				<div class="text-left sm:text-right">
					<p class="text-xs font-semibold tracking-wide text-stone-500 uppercase">Invoice no.</p>
					<p class="font-mono text-base font-bold text-ink">{order.id}</p>
					<p class="mt-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">Order date</p>
					<p class="text-sm font-semibold text-ink">{formatDate(order.placedAt)}</p>
					<p class="mt-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">Estimated delivery</p>
					<p class="text-sm font-semibold text-ink">{shop.estimatedDelivery(order)}</p>
				</div>
			</div>

			<div class="grid gap-6 px-6 py-5 sm:grid-cols-2">
				<div>
					<h2 class="text-xs font-bold tracking-wide text-stone-500 uppercase">Bill to</h2>
					<address class="mt-2 text-sm leading-relaxed text-stone-700 not-italic">
						<span class="font-semibold text-ink">{order.address.name}</span><br />
						{order.address.address}, {order.address.city}, {order.address.state} {order.address.zip}<br />
						{#if order.address.phone}{order.address.phone}<br />{/if}
						{order.address.email}
					</address>
				</div>
				<div>
					<h2 class="text-xs font-bold tracking-wide text-stone-500 uppercase">Payment method</h2>
					<p class="mt-2 text-sm font-semibold text-ink">{order.payment}</p>
					<p class="mt-1 text-sm text-stone-500">
						Status: {order.status === 'cancelled' ? 'Cancelled' : 'Paid'}
					</p>
				</div>
			</div>

			<div class="overflow-x-auto px-6 pb-2">
				<table class="w-full min-w-[480px] text-left text-sm">
					<thead>
						<tr class="border-y border-line text-xs tracking-wide text-stone-500 uppercase">
							<th class="py-2.5 pr-2 font-bold">Item</th>
							<th class="py-2.5 pr-2 font-bold">Qty</th>
							<th class="py-2.5 pr-2 font-bold">Unit price</th>
							<th class="py-2.5 text-right font-bold">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each order.items as item (item.id + '-' + (item.variant ?? ''))}
							<tr class="border-b border-line last:border-0">
								<td class="py-3 pr-2">
									<span class="font-semibold text-ink">{item.name}</span>
									{#if item.variant}
										<span class="block text-xs text-stone-500">
											{getProduct(item.id)?.option.label ?? 'Option'}: {item.variant}
										</span>
									{/if}
								</td>
								<td class="py-3 pr-2 text-stone-600">{item.qty}</td>
								<td class="py-3 pr-2 text-stone-600">{formatPrice(item.price)}</td>
								<td class="py-3 text-right font-semibold text-ink">{formatPrice(item.price * item.qty)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<dl class="space-y-2 border-t border-line bg-cream/60 px-6 py-5 text-sm">
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
				{#if order.giftCardCredit}
					<div class="flex justify-between">
						<dt class="text-stone-500">Gift card credit</dt>
						<dd class="font-semibold text-green-700">−{formatPrice(order.giftCardCredit)}</dd>
					</div>
				{/if}
				<div class="flex justify-between">
					<dt class="text-stone-500">Shipping</dt>
					<dd class="font-semibold text-ink">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</dd>
				</div>
				{#if order.giftWrap}
					<div class="flex justify-between">
						<dt class="text-stone-500">Gift wrap</dt>
						<dd class="font-semibold text-ink">{formatPrice(2.99)}</dd>
					</div>
				{/if}
				<div class="flex justify-between border-t border-line pt-3 text-base">
					<dt class="font-bold text-ink">Total</dt>
					<dd class="font-extrabold text-ink">{formatPrice(order.total)}</dd>
				</div>
			</dl>

			{#if order.notes}
				<div class="border-t border-line px-6 py-4">
					<h2 class="text-xs font-bold tracking-wide text-stone-500 uppercase">Delivery notes</h2>
					<p class="mt-1.5 text-sm text-stone-600">{order.notes}</p>
				</div>
			{/if}

			<div class="border-t border-line px-6 py-4">
				<p class="text-xs leading-relaxed text-stone-500">
					This is a demo invoice generated by ShopMate. Prices include all taxes where applicable.
					For returns within 30 days, visit My Orders and choose Request return.
				</p>
			</div>
		</div>
	{/if}
</div>

<style>
	@media print {
		:global(header),
		:global(footer),
		:global(nav) {
			display: none !important;
		}
		.no-print {
			display: none !important;
		}
	}
</style>
