<script lang="ts">
	const sections = [
		{
			h: 'What we store, in plain words',
			paras: [
				'ShopMate is a demo storefront with no server and no tracking. The only things stored are small pieces of data kept in your own browser — your browser’s localStorage — so the shop can remember your cart, wishlist, account session, orders, recently viewed products and your cookie-banner choice between visits.',
				'Nothing you enter is sent to a server, because there is no server collecting it. There are no analytics, no advertising trackers, no third-party cookies and no fingerprinting.'
			]
		},
		{
			h: 'The cookie banner',
			paras: [
				'When you first visit ShopMate you see a cookie banner. Accepting it records one small choice — “accepted” — in your browser, so we stop asking. Declining records “declined” instead. Either way, the shop still needs local storage for the cart and wishlist to work at all, but nothing is tracked or sent anywhere in either case.',
				'Your choice is stored only on your device. If you clear your browser’s site data for ShopMate, the choice is forgotten and the banner appears again.'
			]
		},
		{
			h: 'What lives in local storage',
			paras: [
				'Your cart (shopmate_cart), wishlist (shopmate_wishlist), account session (shopmate_session), orders (shopmate_orders), saved addresses (shopmate_addresses), recently viewed products (shopmate_recent), reviews you wrote (shopmate_reviews), your comparison list (shopmate_compare), gift cards (shopmate_giftcards) and your cookie choice (shopmate_cookie_choice). All of these live only on your device.',
				'Because everything lives on your device, opening ShopMate on another device or browser starts with an empty cart and no account — your data never left the first device.'
			]
		},
		{
			h: 'How to clear everything',
			paras: [
				'Clear your browser’s site data (or local storage) for shopmates.pages.dev and every trace of your ShopMate activity on this device is gone — cart, wishlist, account, orders and your cookie choice included. You can also delete your account from the Account page.',
				'If you have any questions about cookies or privacy, write to us at hello@shopmate.store.'
			]
		}
	];
</script>

<svelte:head>
	<title>Cookie Policy — ShopMate</title>
	<meta
		name="description"
		content="ShopMate cookie policy: no tracking cookies. Only small on-device storage (localStorage) for your cart, wishlist and preferences — nothing sent to a server."
	/>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Cookie Policy</span>
	</nav>
	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Cookie Policy</h1>
	<p class="mt-2 text-sm text-stone-500">Last updated: November 2026</p>

	{#each sections as section}
		<h2 class="mt-8 text-lg font-bold text-ink">{section.h}</h2>
		{#each section.paras as para}
			<p class="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{para}</p>
		{/each}
	{/each}

	<p class="mt-10 border-t border-line pt-6 text-sm text-stone-500">
		Related: <a href="/privacy-policy" class="font-semibold text-olive hover:text-olive-dark"
			>Privacy Policy</a
		>
	</p>
</section>
