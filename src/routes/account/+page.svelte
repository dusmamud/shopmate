<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import { shop, ORDER_STEPS, formatPrice, formatDate } from '../../lib/data/store.svelte';

	const recentOrders = $derived(shop.myOrders().slice(0, 3));

	function logout() {
		shop.logout();
		goto('/');
	}
</script>

<svelte:head>
	<title>My Account — ShopMate</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	{#if !shop.user}
		<div class="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
			<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive-soft text-olive">
				<Icon name="user" class="h-7 w-7" />
			</div>
			<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">You're not logged in</h1>
			<p class="mt-2 text-sm leading-relaxed text-stone-500">
				Log in to see your profile, orders and saved items — or create a free account to get started.
			</p>
			<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<a
					href="/login"
					class="rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
				>
					Log in
				</a>
				<a
					href="/signup"
					class="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
				>
					Create Account
				</a>
			</div>
			<p class="mt-5 text-xs text-stone-400">Demo store — accounts are saved only on this device.</p>
		</div>
	{:else}
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">My Account</h1>

		<!-- Profile card -->
		<div class="mt-6 flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-olive text-2xl font-extrabold text-white">
					{shop.user.name.charAt(0).toUpperCase()}
				</span>
				<div>
					<p class="text-lg font-bold text-ink">{shop.user.name}</p>
					<p class="text-sm text-stone-500">{shop.user.email}</p>
					<p class="mt-1 flex items-center gap-1.5 text-xs text-stone-400">
						<Icon name="shield" class="h-3.5 w-3.5" />
						Demo account — your details are saved only on this device
					</p>
				</div>
			</div>
			<button
				type="button"
				onclick={logout}
				class="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-red-400 hover:text-red-600 sm:self-center"
			>
				<Icon name="logout" class="h-4 w-4" />
				Log out
			</button>
		</div>

		<!-- Quick actions -->
		<div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
			<a href="/orders" class="group rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg">
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive transition group-hover:bg-olive group-hover:text-white">
					<Icon name="package" class="h-5 w-5" />
				</span>
				<span class="mt-3 block text-sm font-semibold text-ink">My Orders</span>
				<span class="mt-0.5 block text-xs text-stone-500">{shop.myOrders().length} order{shop.myOrders().length === 1 ? '' : 's'}</span>
			</a>
			<a href="/wishlist" class="group rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg">
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive transition group-hover:bg-olive group-hover:text-white">
					<Icon name="heart" class="h-5 w-5" />
				</span>
				<span class="mt-3 block text-sm font-semibold text-ink">Wishlist</span>
				<span class="mt-0.5 block text-xs text-stone-500">{shop.wishlistCount} saved item{shop.wishlistCount === 1 ? '' : 's'}</span>
			</a>
			<a href="/track-order" class="group rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg">
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive transition group-hover:bg-olive group-hover:text-white">
					<Icon name="truck" class="h-5 w-5" />
				</span>
				<span class="mt-3 block text-sm font-semibold text-ink">Track Order</span>
				<span class="mt-0.5 block text-xs text-stone-500">Live delivery status</span>
			</a>
			<a href="/help" class="group rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg">
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive transition group-hover:bg-olive group-hover:text-white">
					<Icon name="headset" class="h-5 w-5" />
				</span>
				<span class="mt-3 block text-sm font-semibold text-ink">Help</span>
				<span class="mt-0.5 block text-xs text-stone-500">Shipping, returns &amp; FAQs</span>
			</a>
		</div>

		<!-- Recent orders -->
		<div class="mt-8">
			<div class="flex items-end justify-between gap-4">
				<h2 class="text-lg font-extrabold tracking-tight text-ink">Recent Orders</h2>
				<a href="/orders" class="flex shrink-0 items-center gap-1.5 text-sm font-medium text-olive hover:text-olive-dark">
					View all <Icon name="arrow-right" class="h-4 w-4" />
				</a>
			</div>
			{#if recentOrders.length === 0}
				<p class="mt-4 rounded-2xl border border-dashed border-line bg-cream px-6 py-10 text-center text-sm text-stone-500">
					You haven't placed any orders yet.
					<a href="/shop" class="font-semibold text-olive hover:text-olive-dark">Start shopping</a>
				</p>
			{:else}
				<div class="mt-4 space-y-3">
					{#each recentOrders as order (order.id)}
						<div class="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
							<div>
								<p class="text-sm font-bold text-ink">Order {order.id}</p>
								<p class="mt-0.5 text-xs text-stone-500">
									{formatDate(order.placedAt)} · {order.items.length} item{order.items.length === 1 ? '' : 's'} · {formatPrice(order.total)}
								</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="rounded-full bg-olive-soft px-3 py-1 text-xs font-semibold text-olive">
									{ORDER_STEPS[shop.orderStep(order)]}
								</span>
								<a
									href="/track-order?id={order.id}"
									class="rounded-lg bg-olive px-4 py-2 text-xs font-semibold text-white transition hover:bg-olive-dark"
								>
									Track
								</a>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>
