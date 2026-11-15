<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { shop } from '../data/store.svelte';

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);

	const itemCls = (active: boolean) =>
		`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
			active ? 'font-bold text-olive' : 'text-stone-500 hover:text-ink'
		}`;
</script>

<nav
	class="fixed inset-x-0 bottom-0 z-50 flex h-14 border-t border-line bg-white/95 backdrop-blur lg:hidden"
	aria-label="Mobile navigation"
>
	<a href="/" class={itemCls(isActive('/'))} aria-current={page.url.pathname === '/' ? 'page' : undefined}>
		<Icon name="home" class="h-5 w-5" />
		Home
	</a>
	<a href="/shop" class={itemCls(isActive('/shop'))} aria-current={isActive('/shop') ? 'page' : undefined}>
		<Icon name="bag" class="h-5 w-5" />
		Shop
	</a>
	<a
		href="/wishlist"
		class={itemCls(isActive('/wishlist'))}
		aria-current={isActive('/wishlist') ? 'page' : undefined}
		aria-label="Wishlist, {shop.wishlistCount} items saved"
	>
		<span class="relative">
			<Icon name="heart" class="h-5 w-5" />
			{#if shop.wishlistCount > 0}
				<span class="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-bold text-white">
					{shop.wishlistCount}
				</span>
			{/if}
		</span>
		Wishlist
	</a>
	<button
		type="button"
		onclick={() => shop.openCart()}
		class={itemCls(false)}
		aria-label="Open cart, {shop.cartCount} items"
	>
		<span class="relative">
			<Icon name="cart" class="h-5 w-5" />
			{#if shop.cartCount > 0}
				<span class="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-bold text-white">
					{shop.cartCount}
				</span>
			{/if}
		</span>
		Cart
	</button>
	<a
		href={shop.user ? '/account' : '/login'}
		class={itemCls(isActive('/account') || isActive('/login'))}
		aria-label={shop.user ? `Account, signed in as ${shop.user.name}` : 'Login or sign up'}
	>
		<Icon name="user" class="h-5 w-5" />
		Account
	</a>
</nav>
