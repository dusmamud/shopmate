<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { products } from '../data/products';
	import { shop } from '../data/store.svelte';

	let menuOpen = $state(false);
	let query = $state('');
	let suggestOpen = $state(false);
	let searchWrap: HTMLDivElement | undefined = $state();

	const suggestions = $derived(
		query.trim().length >= 2
			? products
					.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
					.slice(0, 5)
			: []
	);

	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'Shop', href: '/shop' },
		{ label: 'Categories', href: '/categories' },
		{ label: 'Deals', href: '/deals' },
		{ label: 'Reviews', href: '/#reviews' },
		{ label: 'Contact', href: '/contact' }
	];

	function onSearch(e: Event) {
		query = (e.target as HTMLInputElement).value;
		shop.search = query;
		if (page.url.pathname === '/') {
			if (query.trim()) document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
		} else if (query.trim()) {
			goto(`/shop?q=${encodeURIComponent(query.trim())}`);
		}
	}

	// Desktop search: live suggestions, no navigation while typing.
	// Enter goes to the search page, a suggestion goes straight to the product.
	function onDesktopSearch(e: Event) {
		query = (e.target as HTMLInputElement).value;
		shop.search = query;
		suggestOpen = true;
		if (page.url.pathname === '/' && query.trim()) {
			document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function onDesktopKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			suggestOpen = false;
			if (query.trim()) goto(`/shop?q=${encodeURIComponent(query.trim())}`);
		} else if (e.key === 'Escape') {
			suggestOpen = false;
		}
	}

	function pickSuggestion(id: number) {
		suggestOpen = false;
		query = '';
		shop.search = '';
		goto(`/product/${id}`);
	}

	// Close the suggestion dropdown on a click outside the search box.
	$effect(() => {
		if (!suggestOpen) return;
		const onDocClick = (e: MouseEvent) => {
			if (searchWrap && !searchWrap.contains(e.target as Node)) suggestOpen = false;
		};
		document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	});
</script>

<header class="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
	<div class="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
		<!-- Mobile menu button -->
		<button
			type="button"
			class="rounded-lg p-2 text-ink hover:bg-cream lg:hidden"
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
			onclick={() => (menuOpen = !menuOpen)}
		>
			<Icon name={menuOpen ? 'close' : 'menu'} class="h-6 w-6" />
		</button>

		<!-- Logo -->
		<a href="/" class="flex shrink-0 items-center gap-2" aria-label="ShopMate home">
			<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-olive text-white">
				<Icon name="bag" class="h-5 w-5" />
			</span>
			<span class="text-xl font-extrabold tracking-tight text-ink">ShopMate</span>
		</a>

		<!-- Desktop nav -->
		<nav class="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
			{#each links as link}
				<a href={link.href} class="text-sm font-medium text-stone-600 transition hover:text-olive">
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- Search (desktop) with live suggestions -->
		<div class="relative ml-auto hidden min-w-0 flex-1 max-w-xs md:block" bind:this={searchWrap}>
			<label class="flex items-center gap-2 rounded-full border border-line bg-cream px-3 py-2">
				<Icon name="search" class="h-4 w-4 shrink-0 text-stone-400" />
				<input
					type="search"
					placeholder="Search products..."
					aria-label="Search products"
					aria-expanded={suggestOpen && suggestions.length > 0}
					aria-controls="search-suggestions"
					role="combobox"
					autocomplete="off"
					class="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
					value={query}
					oninput={onDesktopSearch}
					onkeydown={onDesktopKeydown}
					onfocus={() => (suggestOpen = true)}
				/>
			</label>
			{#if suggestOpen && suggestions.length > 0}
				<div
					id="search-suggestions"
					role="listbox"
					aria-label="Search suggestions"
					class="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-xl"
				>
					{#each suggestions as p (p.id)}
						<button
							type="button"
							role="option"
							aria-selected="false"
							onclick={() => pickSuggestion(p.id)}
							class="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-cream"
						>
							<img src={p.src} srcset="{p.src.replace('.webp', '-400.webp')} 400w" sizes="44px" alt="" loading="lazy" decoding="async" class="h-11 w-11 shrink-0 rounded-lg object-cover" />
							<span class="min-w-0 flex-1">
								<span class="block truncate text-sm font-semibold text-ink">{p.name}</span>
								<span class="block text-xs text-stone-500">{p.category}</span>
							</span>
							<span class="shrink-0 text-sm font-bold text-ink">${p.price.toFixed(2)}</span>
						</button>
					{/each}
					<button
						type="button"
						onclick={() => {
							suggestOpen = false;
							if (query.trim()) goto(`/shop?q=${encodeURIComponent(query.trim())}`);
						}}
						class="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-sm font-semibold text-olive transition hover:bg-cream"
					>
						<Icon name="search" class="h-4 w-4" />
						See all results for “{query.trim()}”
					</button>
				</div>
			{/if}
		</div>

		<!-- Actions -->
		<div class="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
			<a
				href="/compare"
				class="relative rounded-full p-2 text-ink transition hover:bg-cream"
				aria-label="Compare products, {shop.compare.length} selected"
			>
				<Icon name="sliders" class="h-5 w-5" />
				{#if shop.compare.length > 0}
					<span class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-bold text-white">
						{shop.compare.length}
					</span>
				{/if}
			</a>
			<a
				href="/wishlist"
				class="relative rounded-full p-2 text-ink transition hover:bg-cream"
				aria-label="Wishlist, {shop.wishlistCount} items saved"
			>
				<Icon name="heart" class="h-5 w-5" />
				{#if shop.wishlistCount > 0}
					<span class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-bold text-white">
						{shop.wishlistCount}
					</span>
				{/if}
			</a>
			<button
				type="button"
				onclick={() => shop.openCart()}
				class="relative rounded-full p-2 text-ink transition hover:bg-cream"
				aria-label="Open cart, {shop.cartCount} items"
			>
				<Icon name="cart" class="h-5 w-5" />
				{#if shop.cartCount > 0}
					<span class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-bold text-white">
						{shop.cartCount}
					</span>
				{/if}
			</button>
			<a
				href={shop.user ? '/account' : '/login'}
				class="hidden rounded-full p-2 text-ink transition hover:bg-cream sm:block"
				aria-label={shop.user ? `Account, signed in as ${shop.user.name}` : 'Login or sign up'}
			>
				<Icon name="user" class="h-5 w-5" />
			</a>
		</div>
	</div>

	<!-- Mobile search -->
	<div class="border-t border-line px-4 py-2 md:hidden">
		<label class="flex items-center gap-2 rounded-full border border-line bg-cream px-3 py-2">
			<Icon name="search" class="h-4 w-4 shrink-0 text-stone-400" />
			<input
				type="search"
				placeholder="Search products..."
				aria-label="Search products"
				class="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
				value={query}
				oninput={onSearch}
			/>
		</label>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<nav class="border-t border-line bg-white px-4 py-3 lg:hidden" aria-label="Mobile navigation">
			<ul class="space-y-1">
				{#each links as link}
					<li>
						<a
							href={link.href}
							class="block rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-cream hover:text-olive"
							onclick={() => (menuOpen = false)}
						>
							{link.label}
						</a>
					</li>
				{/each}
				<li class="border-t border-line pt-1">
					<a
						href={shop.user ? '/account' : '/login'}
						class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-cream hover:text-olive"
						onclick={() => (menuOpen = false)}
					>
						<Icon name="user" class="h-4 w-4" />
						{shop.user ? `My Account (${shop.user.name})` : 'Login / Sign Up'}
					</a>
				</li>
				<li>
					<a
						href="/compare"
						class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-cream hover:text-olive"
						onclick={() => (menuOpen = false)}
					>
						<Icon name="sliders" class="h-4 w-4" /> Compare
						{#if shop.compare.length > 0}
							<span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-olive px-1.5 text-[11px] font-bold text-white">
								{shop.compare.length}
							</span>
						{/if}
					</a>
				</li>
				<li>
					<a
						href="/track-order"
						class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-cream hover:text-olive"
						onclick={() => (menuOpen = false)}
					>
						<Icon name="package" class="h-4 w-4" /> Track Order
					</a>
				</li>
			</ul>
		</nav>
	{/if}
</header>
