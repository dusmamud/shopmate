<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import TrustBar from '#lib/components/TrustBar.svelte';
	import Categories from '#lib/components/Categories.svelte';
	import Products from '#lib/components/Products.svelte';
	import OfferBanner from '#lib/components/OfferBanner.svelte';
	import Testimonials from '#lib/components/Testimonials.svelte';
</script>

<svelte:head>
	<meta
		name="description"
		content="ShopMate — quality electronics, fashion, home & more at honest prices. Free shipping over $50, 30-day returns."
	/>
	<meta property="og:title" content="ShopMate — Discover The Best Products for You" />
	<meta
		property="og:description"
		content="ShopMate — quality electronics, fashion, home & more at honest prices. Free shipping over $50, 30-day returns."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/" />
	<meta property="og:image" content="https://shopmates.pages.dev/hero.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="ShopMate — Discover The Best Products for You" />
	<meta
		name="twitter:description"
		content="ShopMate — quality electronics, fashion, home & more at honest prices. Free shipping over $50, 30-day returns."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/hero.webp" />
</svelte:head>

<Hero />
<TrustBar />
<Categories />
<Products />
<OfferBanner />
<Testimonials />
