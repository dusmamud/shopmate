<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import { shop, formatPrice, formatDate, ORDER_STEPS, type Order } from '../../lib/data/store.svelte';

	const myOrders = $derived(shop.myOrders());

	function reorder(order: Order) {
		for (const item of order.items) shop.addToCart(item.id, item.qty, true);
		shop.showToast('Items added back to your cart');
		goto('/cart');
	}

	function progress(order: Order) {
		return (shop.orderStep(order) / (ORDER_STEPS.length - 1)) * 100;
	}
</script>

<svelte:head>
	<title>My Orders — ShopMate</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">My Orders</h1>

	{#if !shop.user}
		<div class="mt-6 rounded-2xl border border-line bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream">
				<Icon name="lock" class="h-7 w-7 text-olive" />
			</span>
			<h2 class="mt-4 text-lg font-bold text-ink">Please log in to view your orders</h2>
			<p class="mt-1 text-sm text-stone-500">
				Your orders are saved to your account. Log in or create a free account to see them.
			</p>
			<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
				<a href="/login" class="rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark">Log In</a>
				<a href="/signup" class="rounded-lg border border-olive px-6 py-3 text-sm font-semibold text-olive transition hover:bg-olive-soft">Sign Up</a>
			</div>
		</div>
	{:else if myOrders.length === 0}
		<div class="mt-6 rounded-2xl border border-dashed border-line bg-cream px-6 py-14 text-center">
			<Icon name="package" class="mx-auto h-12 w-12 text-stone-300" />
			<p class="mt-4 text-lg font-bold text-ink">You haven't placed any orders yet</p>
			<p class="mt-1 text-sm text-stone-500">When you do, they'll show up here with live tracking.</p>
			<a
				href="/shop"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Start Shopping <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
	{:else}
		<p class="mt-1 text-sm text-stone-500">
			{myOrders.length} {myOrders.length === 1 ? 'order' : 'orders'} · Signed in as {shop.user.email}
		</p>
		<div class="mt-6 space-y-4">
			{#each myOrders as order (order.id)}
				{@const step = shop.orderStep(order)}
				<article class="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-cream/60 px-5 py-3.5">
						<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
							<span class="font-mono font-bold text-ink">{order.id}</span>
							<span class="text-stone-500">{formatDate(order.placedAt)}</span>
							<span class="text-stone-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
						</div>
						<span class="rounded-full bg-olive-soft px-3 py-1 text-xs font-bold text-olive">
							{ORDER_STEPS[step]}
						</span>
					</div>
					<div class="px-5 py-4">
						<div class="flex items-center gap-3">
							<div class="flex -space-x-2">
								{#each order.items.slice(0, 4) as item}
									<img
										src={item.src}
										alt={item.name}
										class="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
									/>
								{/each}
							</div>
							<p class="min-w-0 flex-1 truncate text-sm text-stone-600">
								{order.items.map((i) => i.name).join(', ')}
							</p>
							<p class="shrink-0 text-base font-extrabold text-ink">{formatPrice(order.total)}</p>
						</div>
						<div class="mt-4">
							<div class="h-2 overflow-hidden rounded-full bg-stone-200">
								<div class="h-full rounded-full bg-olive transition-all" style="width: {progress(order)}%"></div>
							</div>
							<div class="mt-1.5 flex justify-between text-[11px] font-medium text-stone-400">
								<span class={step >= 0 ? 'text-olive' : ''}>Placed</span>
								<span class={step >= 2 ? 'text-olive' : ''}>Shipped</span>
								<span class={step >= 4 ? 'text-olive' : ''}>Delivered</span>
							</div>
						</div>
						<div class="mt-4 flex flex-wrap gap-2">
							<a
								href="/track-order?id={order.id}"
								class="inline-flex items-center gap-1.5 rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
							>
								<Icon name="package" class="h-4 w-4" /> Track
							</a>
							<button
								type="button"
								onclick={() => reorder(order)}
								class="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
							>
								<Icon name="cart" class="h-4 w-4" /> Reorder
							</button>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
