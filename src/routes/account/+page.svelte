<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import { shop, ORDER_STEPS, formatPrice, formatDate } from '../../lib/data/store.svelte';

	const recentOrders = $derived(shop.myOrders().slice(0, 3));

	let editName = $state('');
	let profileMsg = $state('');
	let currentPw = $state('');
	let newPw = $state('');
	let confirmPw = $state('');
	let pwMsg = $state('');
	let pwError = $state('');

	// Address book form
	let editingId = $state<string | null>(null);
	let addrLabel = $state('');
	let addrName = $state('');
	let addrEmail = $state('');
	let addrPhone = $state('');
	let addrStreet = $state('');
	let addrCity = $state('');
	let addrState = $state('');
	let addrZip = $state('');
	let addrMsg = $state('');

	function logout() {
		shop.logout();
		goto('/');
	}

	function saveProfile() {
		profileMsg = '';
		if (shop.updateProfile(editName)) {
			profileMsg = 'Name updated.';
			editName = '';
		} else {
			profileMsg = 'Please enter a name with at least 2 characters.';
		}
	}

	function savePassword() {
		pwMsg = '';
		pwError = '';
		if (newPw !== confirmPw) {
			pwError = 'New passwords do not match.';
			return;
		}
		const res = shop.changePassword(currentPw, newPw);
		if (res.ok) {
			pwMsg = 'Password changed.';
			currentPw = '';
			newPw = '';
			confirmPw = '';
		} else {
			pwError = res.error ?? 'Could not change password.';
		}
	}

	function resetAddrForm() {
		editingId = null;
		addrLabel = '';
		addrName = '';
		addrEmail = '';
		addrPhone = '';
		addrStreet = '';
		addrCity = '';
		addrState = '';
		addrZip = '';
	}

	function editAddress(id: string) {
		const a = shop.addresses.find((x) => x.id === id);
		if (!a) return;
		editingId = id;
		addrLabel = a.label;
		addrName = a.name;
		addrEmail = a.email;
		addrPhone = a.phone;
		addrStreet = a.address;
		addrCity = a.city;
		addrState = a.state;
		addrZip = a.zip;
	}

	function saveAddress() {
		addrMsg = '';
		if (!addrName.trim() || !addrStreet.trim() || !addrCity.trim() || !addrState.trim() || !addrZip.trim()) {
			addrMsg = 'Please fill in name, street, city, state and ZIP.';
			return;
		}
		const data = {
			name: addrName.trim(),
			email: addrEmail.trim() || shop.user!.email,
			phone: addrPhone.trim(),
			address: addrStreet.trim(),
			city: addrCity.trim(),
			state: addrState.trim(),
			zip: addrZip.trim(),
			label: addrLabel.trim() || addrCity.trim()
		};
		if (editingId) {
			shop.updateAddress(editingId, data);
			addrMsg = 'Address updated.';
		} else {
			shop.addAddress(data);
			addrMsg = 'Address saved.';
		}
		resetAddrForm();
	}
</script>

<svelte:head>
	<title>My Account — ShopMate</title>
	<meta
		name="description"
		content="Your ShopMate account — edit your profile, change your password, manage saved addresses and view recent orders. Log in to see your profile and saved items."
	/>
	<meta name="robots" content="noindex, follow" />
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
			<p class="mt-5 text-xs text-stone-500">Demo store — accounts are saved only on this device.</p>
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
					<p class="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
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

		<!-- Profile & security -->
		<div class="mt-6 grid gap-6 lg:grid-cols-2">
			<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
				<h2 class="text-base font-bold text-ink">Edit Profile</h2>
				<p class="mt-1 text-xs text-stone-500">Signed in as {shop.user.email}</p>
				<form
					class="mt-4 flex gap-2"
					onsubmit={(e) => {
						e.preventDefault();
						saveProfile();
					}}
				>
					<label class="sr-only" for="edit-name">Full name</label>
					<input
						id="edit-name"
						type="text"
						bind:value={editName}
						placeholder={shop.user.name}
						class="min-w-0 flex-1 rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
					/>
					<button
						type="submit"
						class="shrink-0 rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Save
					</button>
				</form>
				{#if profileMsg}<p class="mt-2 text-xs text-olive">{profileMsg}</p>{/if}
			</section>

			<section class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
				<h2 class="text-base font-bold text-ink">Change Password</h2>
				<form
					class="mt-4 space-y-3"
					onsubmit={(e) => {
						e.preventDefault();
						savePassword();
					}}
				>
					<div>
						<label for="current-pw" class="text-xs font-semibold text-stone-500">Current password</label>
						<input
							id="current-pw"
							type="password"
							bind:value={currentPw}
							autocomplete="current-password"
							class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-olive"
						/>
					</div>
					<div class="grid gap-3 sm:grid-cols-2">
						<div>
							<label for="new-pw" class="text-xs font-semibold text-stone-500">New password</label>
							<input
								id="new-pw"
								type="password"
								bind:value={newPw}
								autocomplete="new-password"
								class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-olive"
							/>
						</div>
						<div>
							<label for="confirm-pw" class="text-xs font-semibold text-stone-500">Confirm new password</label>
							<input
								id="confirm-pw"
								type="password"
								bind:value={confirmPw}
								autocomplete="new-password"
								class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm text-ink outline-none focus:border-olive"
							/>
						</div>
					</div>
					<button
						type="submit"
						class="rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Change Password
					</button>
					{#if pwError}<p class="text-xs text-red-600">{pwError}</p>{/if}
					{#if pwMsg}<p class="text-xs text-olive">{pwMsg}</p>{/if}
				</form>
			</section>
		</div>

		<!-- Address book -->
		<section class="mt-6 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
			<h2 class="text-base font-bold text-ink">Saved Addresses</h2>
			<p class="mt-1 text-xs text-stone-500">
				Your default address is prefilled at checkout. Addresses are saved only on this device.
			</p>
			{#if shop.addresses.length > 0}
				<ul class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each shop.addresses as a (a.id)}
						<li class="rounded-xl border border-line p-4">
							<p class="flex items-center gap-2 text-sm font-semibold text-ink">
								<Icon name="pin" class="h-4 w-4 text-olive" /> {a.label}
								{#if a.isDefault}
									<span class="rounded-full bg-olive px-2 py-0.5 text-[10px] font-bold text-white">Default</span>
								{/if}
							</p>
							<p class="mt-1.5 text-xs leading-relaxed text-stone-500">
								{a.name}<br />{a.address}, {a.city}, {a.state} {a.zip}
							</p>
							<div class="mt-3 flex flex-wrap gap-2">
								<button
									type="button"
									onclick={() => editAddress(a.id)}
									class="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-olive"
								>
									Edit
								</button>
								{#if !a.isDefault}
									<button
										type="button"
										onclick={() => shop.setDefaultAddress(a.id)}
										class="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-olive"
									>
										Set as default
									</button>
								{/if}
								<button
									type="button"
									onclick={() => shop.removeAddress(a.id)}
									class="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-400"
								>
									Delete
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mt-4 rounded-xl bg-cream px-4 py-3 text-sm text-stone-600">
					No saved addresses yet — add one below, or tick "Save this address" at checkout.
				</p>
			{/if}
			<form
				class="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-2"
				onsubmit={(e) => {
					e.preventDefault();
					saveAddress();
				}}
			>
				<div class="sm:col-span-2">
					<h3 class="text-sm font-bold text-ink">{editingId ? 'Edit address' : 'Add a new address'}</h3>
				</div>
				<div>
					<label for="addr-label" class="text-xs font-semibold text-stone-500">Label (e.g. Home, Office)</label>
					<input id="addr-label" type="text" bind:value={addrLabel} placeholder="Home" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-name" class="text-xs font-semibold text-stone-500">Full name *</label>
					<input id="addr-name" type="text" bind:value={addrName} placeholder={shop.user.name} class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-email" class="text-xs font-semibold text-stone-500">Email</label>
					<input id="addr-email" type="email" bind:value={addrEmail} placeholder={shop.user.email} class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-phone" class="text-xs font-semibold text-stone-500">Phone</label>
					<input id="addr-phone" type="tel" bind:value={addrPhone} placeholder="+1 555 010 1234" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div class="sm:col-span-2">
					<label for="addr-street" class="text-xs font-semibold text-stone-500">Street address *</label>
					<input id="addr-street" type="text" bind:value={addrStreet} placeholder="123 Main Street, Apt 4" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-city" class="text-xs font-semibold text-stone-500">City *</label>
					<input id="addr-city" type="text" bind:value={addrCity} placeholder="New York" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-state" class="text-xs font-semibold text-stone-500">State *</label>
					<input id="addr-state" type="text" bind:value={addrState} placeholder="NY" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div>
					<label for="addr-zip" class="text-xs font-semibold text-stone-500">ZIP code *</label>
					<input id="addr-zip" type="text" bind:value={addrZip} placeholder="10001" class="mt-1.5 w-full rounded-lg border border-line px-3.5 py-2.5 text-sm outline-none focus:border-olive" />
				</div>
				<div class="flex items-center gap-2 sm:col-span-2">
					<button
						type="submit"
						class="rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						{editingId ? 'Update Address' : 'Save Address'}
					</button>
					{#if editingId}
						<button
							type="button"
							onclick={resetAddrForm}
							class="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-olive"
						>
							Cancel
						</button>
					{/if}
					{#if addrMsg}<p class="text-xs text-olive">{addrMsg}</p>{/if}
				</div>
			</form>
		</section>

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
				<p class="mt-4 rounded-2xl border border-dashed border-line bg-cream px-6 py-10 text-center text-sm text-stone-600">
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
