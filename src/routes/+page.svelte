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
	<link rel="canonical" href="https://shopmates.pages.dev/" />
	<link
		rel="preload"
		as="image"
		href="/hero-1200.webp"
		imagesrcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w, /hero.webp 1920w"
		imagesizes="(max-width: 1023px) 100vw, 50vw"
		fetchpriority="high"
	/>
	<meta property="og:title" content="ShopMate — Discover The Best Products for You" />
	<meta
		property="og:description"
		content="ShopMate — quality electronics, fashion, home & more at honest prices. Free shipping over $50, 30-day returns."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="ShopMate — Discover The Best Products for You" />
	<meta
		name="twitter:description"
		content="ShopMate — quality electronics, fashion, home & more at honest prices. Free shipping over $50, 30-day returns."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
	{@html `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","@id":"https://shopmates.pages.dev/#website","url":"https://shopmates.pages.dev/","name":"ShopMate","potentialAction":{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://shopmates.pages.dev/shop?q={search_term_string}"},"query-input":"required name=search_term_string"}}</script>`}
</svelte:head>

<Hero />
<TrustBar />
<Categories />
<Products />
<OfferBanner />
<Testimonials />
