<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { shop, formatPrice, formatDate, ORDER_STEPS, type Order } from '../../lib/data/store.svelte';

	const myOrders = $derived(shop.myOrders());

	let confirmCancelId = $state<string | null>(null);

	// Return form state (one form open at a time; items keyed by their index).
	let returnOpenId = $state<string | null>(null);
	let returnChecked = $state<Set<number>>(new Set());
	let returnReason = $state('Wrong size');
	let returnDetail = $state('');

	const RETURN_REASONS = [
		'Wrong size',
		'Defective or damaged',
		'Changed my mind',
		'Arrived late',
		'Other'
	];

	function openReturnForm(order: Order) {
		returnOpenId = order.id;
		returnChecked = new Set(order.items.map((_, i) => i));
		returnReason = 'Wrong size';
		returnDetail = '';
	}

	function submitReturn(order: Order) {
		const items = order.items
			.filter((_, i) => returnChecked.has(i))
			.map((item) => ({ productId: item.id, qty: 1 }));
		if (shop.requestReturn(order.id, items, returnReason, returnDetail)) {
			returnOpenId = null;
		}
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
				{@const ret = shop.getReturn(order.id)}
				<article class="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
					<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-cream/60 px-5 py-3.5">
						<div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
							<span class="font-mono font-bold text-ink">{order.id}</span>
							<span class="text-stone-500">{formatDate(order.placedAt)}</span>
							<span class="text-stone-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
						</div>
						<span class="rounded-full px-3 py-1 text-xs font-bold {order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-olive-soft text-olive'}">
							{order.status === 'cancelled' ? 'Cancelled' : ORDER_STEPS[step]}
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
								<div class="h-full rounded-full {order.status === 'cancelled' ? 'bg-red-400' : 'bg-olive'} transition-all" style="width: {order.status === 'cancelled' ? 100 : progress(order)}%"></div>
							</div>
							<div class="mt-1.5 flex justify-between text-[11px] font-medium text-stone-400">
								<span class={step >= 0 && order.status !== 'cancelled' ? 'text-olive' : ''}>Placed</span>
								<span class={step >= 2 && order.status !== 'cancelled' ? 'text-olive' : ''}>Shipped</span>
								<span class={step >= 4 && order.status !== 'cancelled' ? 'text-olive' : ''}>Delivered</span>
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
								onclick={() => shop.buyAgain(order.id)}
								class="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
							>
								<Icon name="cart" class="h-4 w-4" /> Buy again
							</button>
							{#if ret}
								<span class="inline-flex items-center gap-1.5 rounded-lg bg-olive-soft px-4 py-2.5 text-sm font-semibold text-olive">
									<Icon name="returns" class="h-4 w-4" /> Return {ret.status}
								</span>
							{:else if step >= 2 && order.status === 'active'}
								<button
									type="button"
									onclick={() => openReturnForm(order)}
									class="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
								>
									<Icon name="returns" class="h-4 w-4" /> Request return
								</button>
							{/if}
							{#if shop.isCancellable(order)}
								{#if confirmCancelId === order.id}
									<button
										type="button"
										onclick={() => {
											shop.cancelOrder(order.id);
											confirmCancelId = null;
										}}
										class="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
									>
										Confirm cancel?
									</button>
									<button
										type="button"
										onclick={() => (confirmCancelId = null)}
										class="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
									>
										Keep order
									</button>
								{:else}
									<button
										type="button"
										onclick={() => (confirmCancelId = order.id)}
										class="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-400"
									>
										Cancel Order
									</button>
								{/if}
							{/if}
						</div>

						{#if ret}
							<div class="mt-4 rounded-xl border border-olive/30 bg-olive-soft px-4 py-3.5 text-sm">
								<p class="flex items-center gap-2 font-bold text-olive-dark">
									<Icon name="check-circle" class="h-4 w-4" /> Return requested
								</p>
								<p class="mt-1.5 text-stone-600">
									Request <span class="font-mono font-bold text-ink">{ret.id}</span> · {ret.reason} ·
									Requested {formatDate(ret.requestedAt)} · Status: {ret.status}
								</p>
								<p class="mt-1 text-stone-500">A return label will be emailed to you shortly.</p>
							</div>
						{:else if returnOpenId === order.id}
							<form
								class="mt-4 rounded-xl border border-line bg-cream/60 p-4"
								onsubmit={(e) => {
									e.preventDefault();
									submitReturn(order);
								}}
							>
								<h3 class="text-sm font-bold text-ink">Request a return</h3>
								<fieldset class="mt-3">
									<legend class="sr-only">Items to return</legend>
									<ul class="space-y-2">
										{#each order.items as item, i (item.id + '-' + (item.variant ?? '') + '-' + i)}
											<li>
												<label class="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
													<input
														type="checkbox"
														checked={returnChecked.has(i)}
														onchange={(e) => {
															const next = new Set(returnChecked);
															if ((e.target as HTMLInputElement).checked) next.add(i);
															else next.delete(i);
															returnChecked = next;
														}}
														class="h-4 w-4 accent-[#5c7038]"
													/>
													<span class="min-w-0 flex-1 truncate">{item.name}{#if item.variant} · {item.variant}{/if}</span>
													<span class="shrink-0 text-xs text-stone-500">Qty 1</span>
												</label>
											</li>
										{/each}
									</ul>
								</fieldset>
								<div class="mt-3 grid gap-3 sm:grid-cols-2">
									<label class="block">
										<span class="text-xs font-semibold text-stone-500">Reason</span>
										<select
											bind:value={returnReason}
											class="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
										>
											{#each RETURN_REASONS as reason}
												<option value={reason}>{reason}</option>
											{/each}
										</select>
									</label>
									<label class="block">
										<span class="text-xs font-semibold text-stone-500">Details (optional)</span>
										<textarea
											bind:value={returnDetail}
											rows="1"
											placeholder="Tell us a little more..."
											class="mt-1.5 w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
										></textarea>
									</label>
								</div>
								<div class="mt-3 flex flex-wrap gap-2">
									<button
										type="submit"
										disabled={returnChecked.size === 0}
										class="rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark disabled:cursor-not-allowed disabled:opacity-50"
									>
										Submit return request
									</button>
									<button
										type="button"
										onclick={() => (returnOpenId = null)}
										class="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
									>
										Cancel
									</button>
								</div>
							</form>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{/if}
</div>
