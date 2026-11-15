<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import Header from '#lib/components/Header.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import CartDrawer from '#lib/components/CartDrawer.svelte';
	import QuickView from '#lib/components/QuickView.svelte';
	import BottomNav from '#lib/components/BottomNav.svelte';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>ShopMate — Discover The Best Products for You</title>
	<meta
		name="description"
		content="ShopMate — your one-stop shop for quality products at the best prices. Free shipping over $50, secure payment, easy 30-day returns."
	/>
	<meta property="og:title" content="ShopMate — Discover The Best Products for You" />
	<meta
		property="og:description"
		content="Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!"
	/>
	<meta property="og:type" content="website" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<Header />
<main>{@render children()}</main>
<Footer />
<!-- Spacer so the fixed mobile bottom nav never covers footer content -->
<div class="h-14 lg:hidden" aria-hidden="true"></div>
<CartDrawer />
<QuickView />
<BottomNav />
<Toast />
