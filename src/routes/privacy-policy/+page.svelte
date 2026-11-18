<script lang="ts">
	const sections = [
		{
			h: 'What we collect',
			paras: [
				'When you create an account, we store the name, email address and a hashed password you provide. When you place an order, we store the delivery details and order contents you enter at checkout. Your cart and wishlist are stored as you use them.',
				'We do not ask for payment details that we keep: this is a demo store, so checkout never processes a real payment and no card or bank details are stored anywhere.'
			]
		},
		{
			h: 'Where your data lives',
			paras: [
				'Everything ShopMate stores about you lives only in your own browser, in localStorage on your device. Nothing you enter — not your account, not your cart, not your orders — is sent to a server, because there is no server storing your data. If you open ShopMate on another device or browser, your account and orders will not be there, because they never left the first device.',
				'That also means we cannot see, access, share or sell your data. There is no analytics, no tracking and no advertising profile built from your visits.'
			]
		},
		{
			h: 'Cookies and local storage',
			paras: [
				'ShopMate does not use tracking cookies. It uses your browser’s local storage to remember your cart, wishlist, account session, orders, recently viewed products and your cookie-banner choice. Clearing your browser data removes all of it.',
				'If you accept the cookie banner, you are agreeing to this on-device storage only. If you decline, we still need local storage for the cart and wishlist to work at all — but nothing is tracked or sent anywhere either way.'
			]
		},
		{
			h: 'What we do not collect',
			paras: [
				'We do not collect your location, your browsing history on other sites, or any payment information. We do not run analytics, fingerprinting, or third-party trackers. We do not share anything with anyone, because we do not receive anything from you in the first place.'
			]
		},
		{
			h: 'Your rights',
			paras: [
				'Because your data lives only on your device, you are always in control. Clearing your browser’s site data for ShopMate deletes your account, cart, wishlist and orders immediately. You can also delete your account from the Account page, or log out at any time to end the session on that device.',
				'If you have any questions about privacy, write to us at hello@shopmate.store.'
			]
		}
	];
</script>

<svelte:head>
	<title>Privacy Policy — ShopMate</title>
	<meta
		name="description"
		content="ShopMate privacy policy: your account, cart and orders are stored only in your browser (localStorage). No tracking, no servers, no payment details stored."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/privacy-policy" />
	<meta property="og:title" content="Privacy Policy — ShopMate" />
	<meta
		property="og:description"
		content="ShopMate privacy policy: your account, cart and orders are stored only in your browser (localStorage). No tracking, no servers, no payment details stored."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/privacy-policy" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Privacy Policy — ShopMate" />
	<meta
		name="twitter:description"
		content="ShopMate privacy policy: your account, cart and orders are stored only in your browser (localStorage). No tracking, no servers, no payment details stored."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Privacy Policy</span>
	</nav>

	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Privacy Policy</h1>
	<p class="mt-2 text-sm text-stone-500">Last updated: November 15, 2026</p>
	<p class="mt-4 text-base leading-relaxed text-stone-600">
		ShopMate is a demo store, and our privacy approach is simple: your information stays on your
		device. This policy explains what is stored, where it lives, and what we never collect.
	</p>

	{#each sections as section (section.h)}
		<h2 class="mt-8 text-lg font-bold text-ink sm:text-xl">{section.h}</h2>
		{#each section.paras as para (para.slice(0, 48))}
			<p class="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">{para}</p>
		{/each}
	{/each}

	<div class="mt-10 rounded-2xl bg-cream p-5 sm:p-6">
		<h2 class="text-base font-bold text-ink">Questions?</h2>
		<p class="mt-2 text-sm leading-relaxed text-stone-600">
			Write to us at
			<a href="mailto:hello@shopmate.store" class="font-semibold text-olive underline underline-offset-2">
				hello@shopmate.store
			</a>
			— we reply within 24 hours, Monday to Saturday.
		</p>
	</div>
</section>
