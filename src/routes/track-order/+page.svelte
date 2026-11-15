<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { getProduct } from '../../lib/data/products';
	import { shop, formatPrice, formatDate, ORDER_STEPS, type Order } from '../../lib/data/store.svelte';

	let searchId = $state('');
	let submitted = $state(false);

	// The order ID comes from ?id=, which is only readable in the browser
	// (searchParams is unavailable while prerendering on the server).
	onMount(() => {
		const id = page.url.searchParams.get('id');
		if (id) {
			searchId = id;
			submitted = true;
		}
	});

	const found = $derived(submitted && searchId.trim() ? shop.findOrder(searchId) : undefined);
	const recent = $derived(shop.myOrders().slice(0, 3));

	function track() {
		submitted = true;
	}

	function quickTrack(order: Order) {
		searchId = order.id;
		submitted = true;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Track Order — ShopMate</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Track Your Order</h1>
	<p class="mt-1 text-sm text-stone-500">Enter your order ID to see where your package is.</p>

	<form
		class="mt-5 flex gap-2"
		onsubmit={(e) => {
			e.preventDefault();
			track();
		}}
	>
		<label class="relative min-w-0 flex-1">
			<span class="sr-only">Order ID</span>
			<Icon name="package" class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-stone-400" />
			<input
				type="text"
				bind:value={searchId}
				placeholder="e.g. SMXXXXXXXX"
				autocomplete="off"
				class="w-full rounded-lg border border-line bg-white py-3 pr-4 pl-11 font-mono text-sm uppercase placeholder:normal-case focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none"
			/>
		</label>
		<button
			type="submit"
			class="flex shrink-0 items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			<Icon name="search" class="h-4 w-4" /> Track
		</button>
	</form>
	{#if !submitted}
		<p class="mt-2.5 flex items-start gap-1.5 text-xs text-stone-400">
			<Icon name="alert" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
			Your order ID looks like SMXXXXXXXX — you'll find it on the order confirmation page and in your order confirmation email.
		</p>
	{/if}

	{#if submitted && !found}
		<div class="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5">
			<Icon name="alert" class="h-5 w-5 shrink-0 text-red-500" />
			<div>
				<p class="text-sm font-bold text-red-700">We couldn't find an order with this ID.</p>
				<p class="mt-1 text-sm text-red-600">
					Check the ID and try again. Order IDs start with “SM” and are shown right after you place an order.
				</p>
			</div>
		</div>
	{/if}

	{#if found}
		{@const step = shop.orderStep(found)}
		<div class="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<div class="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-cream/60 px-5 py-4">
				<div>
					<p class="font-mono text-sm font-bold text-ink">{found.id}</p>
					<p class="text-xs text-stone-500">
						Placed {formatDate(found.placedAt)} · {found.payment}
					</p>
				</div>
				<span class="rounded-full bg-olive-soft px-3 py-1 text-xs font-bold text-olive">
					{ORDER_STEPS[step]}
				</span>
			</div>

			<div class="px-5 py-5">
				<p class="flex items-center gap-2 text-sm text-stone-600">
					<Icon name="truck" class="h-4 w-4 text-olive" />
					Estimated delivery by <span class="font-semibold text-ink">{shop.estimatedDelivery(found)}</span>
				</p>

				<!-- Vertical timeline -->
				<ol class="mt-6 space-y-0">
					{#each ORDER_STEPS as label, i}
						<li class="relative flex gap-4 pb-6 last:pb-0">
							{#if i < ORDER_STEPS.length - 1}
								<span
									class="absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 {i < step ? 'bg-olive' : 'bg-stone-200'}"
									aria-hidden="true"
								></span>
							{/if}
							<span
								class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full {i < step
									? 'bg-olive text-white'
									: i === step
										? 'bg-olive text-white ring-4 ring-olive-soft'
										: 'bg-stone-200 text-stone-400'}"
							>
								{#if i < step}
									<Icon name="check" class="h-4 w-4" />
								{:else if i === step}
									<span class="h-2.5 w-2.5 rounded-full bg-white"></span>
								{:else}
									<span class="h-2.5 w-2.5 rounded-full bg-stone-400"></span>
								{/if}
							</span>
							<span class="pt-1">
								<span class="block text-sm font-semibold {i <= step ? 'text-ink' : 'text-stone-400'}">
									{label}
								</span>
								<span class="text-xs {i <= step ? 'text-stone-500' : 'text-stone-400'}">
									{#if i < step}Completed
									{:else if i === step}Current status
									{:else}Pending{/if}
								</span>
							</span>
						</li>
					{/each}
				</ol>
			</div>

			<div class="border-t border-line px-5 py-4">
				<h2 class="text-sm font-bold text-ink">Items in this order</h2>
				<ul class="mt-3 space-y-3">
					{#each found.items as item (item.id)}
						<li class="flex items-center gap-3">
							<a href="/product/{item.id}" class="block h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f6f1e7]">
								<img src={item.src} alt={item.name} class="h-full w-full object-cover" />
							</a>
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-semibold text-ink">{item.name}</span>
								<span class="text-xs text-stone-500">Qty {item.qty} · {formatPrice(item.price)} each{#if item.variant} · {getProduct(item.id)?.option.label ?? 'Option'}: {item.variant}{/if}</span>
							</span>
							<span class="text-sm font-bold text-ink">{formatPrice(item.price * item.qty)}</span>
						</li>
					{/each}
				</ul>
				<p class="mt-4 flex justify-between border-t border-line pt-3 text-sm">
					<span class="font-bold text-ink">Total</span>
					<span class="font-extrabold text-ink">{formatPrice(found.total)}</span>
				</p>
			</div>

			<div class="border-t border-line bg-cream/60 px-5 py-4">
				<h2 class="flex items-center gap-2 text-sm font-bold text-ink">
					<Icon name="pin" class="h-4 w-4 text-olive" /> Deliver to
				</h2>
				<address class="mt-1.5 text-sm leading-relaxed text-stone-600 not-italic">
					{found.address.name}, {found.address.address}, {found.address.city}, {found.address.state}
					{found.address.zip}
				</address>
			</div>
		</div>
	{/if}

	{#if shop.user && recent.length > 0}
		<section class="mt-8">
			<h2 class="text-base font-bold text-ink">Your recent orders</h2>
			<ul class="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				{#each recent as order (order.id)}
					<li class="flex flex-wrap items-center gap-3 px-5 py-4">
						<div class="min-w-0 flex-1">
							<p class="font-mono text-sm font-bold text-ink">{order.id}</p>
							<p class="text-xs text-stone-500">
								{formatDate(order.placedAt)} · {ORDER_STEPS[shop.orderStep(order)]} · {formatPrice(order.total)}
							</p>
						</div>
						<button
							type="button"
							onclick={() => quickTrack(order)}
							class="rounded-lg border border-olive px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive-soft"
						>
							Track
						</button>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class="mt-8 text-center">
		<a href="/shop" class="text-sm font-medium text-olive hover:text-olive-dark">Continue Shopping →</a>
	</div>
</div>
