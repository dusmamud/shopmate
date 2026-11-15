<script lang="ts">
	const sections = [
		{
			h: 'A demo store',
			paras: [
				'ShopMate is a demonstration storefront. Browsing, accounts, carts and checkout all work, but no real payment is processed, no order is actually fulfilled, and no parcel is shipped. Prices, stock levels and delivery dates shown on the site are illustrative. By using the site you agree that nothing you do here creates a real purchase contract.'
			]
		},
		{
			h: 'Pricing',
			paras: [
				'All prices are shown in US dollars (USD) and are inclusive of all taxes. A product’s price may change at any time, but the price shown at the moment you place an order is the price that applies to that order. Discounts shown against a product are calculated from its listed original price.'
			]
		},
		{
			h: 'Orders',
			paras: [
				'When you place an order you receive an order ID (starting with “SM”). In this demo, orders are stored only in your browser and are not sent to us or fulfilled. You can view and track them on the My Orders and Track Order pages on the same device and browser where they were placed.',
				'We may refuse or cancel an order at any time — for example if a product is out of stock or a price was shown incorrectly. If that happens we will let you know, and no payment is taken in any case.'
			]
		},
		{
			h: 'Promo codes',
			paras: [
				'Promo codes such as WELCOME10 (10% off) and FREESHIP (free shipping) are demo offers. Only one promo code can be applied per order, and codes cannot be combined with each other. Codes may be withdrawn or changed at any time.'
			]
		},
		{
			h: 'Returns and refunds',
			paras: [
				'You can return any unused item in its original packaging within 30 days of delivery. See our Returns & Refunds policy for the full process. Because no real payment is taken in this demo, no real refund is processed either.'
			]
		},
		{
			h: 'Your account',
			paras: [
				'You are responsible for keeping your account details safe on your device. Accounts live only in your browser, so clearing your browser data will remove your account and its orders. You can delete your account at any time from the Account page.'
			]
		},
		{
			h: 'Liability',
			paras: [
				'ShopMate is provided “as is” for demonstration purposes, without warranties of any kind. To the fullest extent permitted by law, we are not liable for any loss or damage arising from the use of this demo site, including lost orders or data stored only in your browser.'
			]
		},
		{
			h: 'Changes to these terms',
			paras: [
				'We may update these terms from time to time. The version published on this page is the current one, and continued use of the site after a change means you accept the updated terms. Questions about these terms can be sent to hello@shopmate.store.'
			]
		}
	];
</script>

<svelte:head>
	<title>Terms of Service — ShopMate</title>
	<meta
		name="description"
		content="ShopMate terms of service: a demo store — no real payments or fulfilment. Pricing in USD with taxes included, demo orders, promo codes, 30-day returns."
	/>
	<meta property="og:title" content="Terms of Service — ShopMate" />
	<meta
		property="og:description"
		content="ShopMate is a demo store: no real payments, no real fulfilment. Read the terms on pricing, orders, promo codes and returns."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://shopmates.pages.dev/hero.webp" />
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Terms of Service</span>
	</nav>

	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Terms of Service</h1>
	<p class="mt-2 text-sm text-stone-500">Last updated: November 15, 2026</p>
	<p class="mt-4 text-base leading-relaxed text-stone-600">
		These terms govern your use of ShopMate. Please read them — they are written in plain language
		on purpose.
	</p>

	{#each sections as section (section.h)}
		<h2 class="mt-8 text-lg font-bold text-ink sm:text-xl">{section.h}</h2>
		{#each section.paras as para (para.slice(0, 48))}
			<p class="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">{para}</p>
		{/each}
	{/each}

	<div class="mt-10 rounded-2xl bg-cream p-5 sm:p-6">
		<h2 class="text-base font-bold text-ink">Questions about these terms?</h2>
		<p class="mt-2 text-sm leading-relaxed text-stone-600">
			Write to us at
			<a href="mailto:hello@shopmate.store" class="font-semibold text-olive underline underline-offset-2">
				hello@shopmate.store
			</a>.
		</p>
	</div>
</section>
