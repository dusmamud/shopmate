<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import CartDrawer from '#lib/components/CartDrawer.svelte';
	import QuickView from '#lib/components/QuickView.svelte';
	import BottomNav from '#lib/components/BottomNav.svelte';
	import CookieBanner from '#lib/components/CookieBanner.svelte';
	import CompareTray from '#lib/components/CompareTray.svelte';
	import LiveChat from '#lib/components/LiveChat.svelte';
	import Icon from '#lib/components/Icon.svelte';

	let { children }: LayoutProps = $props();

	const orgJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': 'https://shopmates.pages.dev/#organization',
		name: 'ShopMate',
		url: 'https://shopmates.pages.dev/',
		logo: 'https://shopmates.pages.dev/favicon.svg',
		// Site-wide return policy (30-day easy returns, full refund — see
		// /returns-policy). MerchantReturnLink form: the site states no
		// shipping/return country, so no applicableCountry is invented.
		hasMerchantReturnPolicy: {
			'@type': 'MerchantReturnPolicy',
			'@id': 'https://shopmates.pages.dev/#return-policy',
			merchantReturnLink: 'https://shopmates.pages.dev/returns-policy',
			returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
			merchantReturnDays: 30,
			returnMethod: 'https://schema.org/ReturnByMail',
			returnFees: 'https://schema.org/FreeReturn',
			refundType: 'https://schema.org/FullRefund'
		},
		// Site-wide shipping (free over $50, otherwise $4.99 flat — see
		// /shipping-policy). No destination: the site states no shipping country.
		hasShippingService: [
			{
				'@type': 'ShippingService',
				name: 'Free shipping over $50',
				shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'USD' }
			},
			{
				'@type': 'ShippingService',
				name: 'Standard shipping',
				shippingRate: { '@type': 'MonetaryAmount', value: 4.99, currency: 'USD' }
			}
		]
	});

	const messages = [
		'Free shipping on orders over $50',
		'Extra 10% off your first order — code WELCOME10',
		'30-day easy returns, no questions asked'
	];
	let msgIndex = $state(0);
	let showTop = $state(false);
	let barTimer: ReturnType<typeof setInterval> | undefined;

	// Rotating announcement bar (browser only; SSR renders message 0).
	onMount(() => {
		barTimer = setInterval(() => {
			msgIndex = (msgIndex + 1) % messages.length;
		}, 5000);
		const onScroll = () => {
			showTop = window.scrollY > 600;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
	onDestroy(() => clearInterval(barTimer));

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>ShopMate — Discover The Best Products for You</title>
	<link
		rel="preload"
		href="/fonts/plus-jakarta-sans-var.woff2"
		as="font"
		type="font/woff2"
		crossorigin
	/>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	{@html `<script type="application/ld+json">${orgJsonLd}</script>`}
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[80] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
>
	Skip to content
</a>

<!-- Announcement bar: scrolls away, header below stays sticky -->
<div class="bg-ink px-4 py-2 text-center text-xs text-white sm:text-sm" role="status">
	{messages[msgIndex]}
</div>

<Header />
<main id="main">{@render children()}</main>
<Footer />
<!-- Spacer so the fixed mobile bottom nav never covers footer content -->
<div class="h-14 lg:hidden" aria-hidden="true"></div>
<CartDrawer />
<QuickView />
<BottomNav />
<CookieBanner />
<Toast />
<CompareTray />
<LiveChat />

{#if showTop}
	<button
		type="button"
		onclick={scrollToTop}
		aria-label="Back to top"
		class="fixed right-4 bottom-36 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-olive text-white shadow-lg transition hover:bg-olive-dark"
	>
		<Icon name="chevron-left" class="h-5 w-5 rotate-90" />
	</button>
{/if}
