<script lang="ts">
	const sections = [
		{
			h: 'Our commitment',
			paras: [
				'ShopMate aims to be usable by everyone, including people who shop with a keyboard, a screen reader, or zoomed text. We design pages with clear headings, visible focus states, real buttons and links, and text that stays readable when enlarged.',
				'This is a demo storefront, and accessibility is a work in progress — if something gets in your way, we want to know about it.'
			]
		},
		{
			h: 'What we do today',
			paras: [
				'Every page has a clear heading structure and a descriptive title. Product photos have alt text, icon-only buttons carry accessible labels, and form fields are labelled. Colour is never the only way we show information — stock, errors and success states also use text and icons.',
				'The site works with a keyboard alone: tab through links, buttons and forms, and use Enter or Space to activate them. Tap targets on mobile are at least 44px, and text stays legible at small sizes.'
			]
		},
		{
			h: 'Motion and contrast',
			paras: [
				'Animations on ShopMate are subtle — card entrances, scroll reveals and press feedback. If your device is set to prefer reduced motion, those animations are turned off automatically.',
				'Body text uses dark ink on light backgrounds for strong contrast, and interactive elements keep a visible hover and focus state.'
			]
		},
		{
			h: 'Known limitations',
			paras: [
				'Some demo features — such as the live-chat panel and the product quick view — open as overlays; they can be closed with the visible close button or the Escape key on desktop. Product photos are AI-generated, so their alt text describes the product rather than every detail in the image.',
				'Checkout is a demo: no real payment is processed, and no order is ever shipped.'
			]
		},
		{
			h: 'Tell us about a barrier',
			paras: [
				'If you hit a barrier while using ShopMate — a page that is hard to read, a button your screen reader skips, or anything else — please tell us through the Contact page or by email at hello@shopmate.store. Describe the page and what you were trying to do, and we will look into it.',
				'We review accessibility feedback alongside every other improvement to the shop.'
			]
		}
	];
</script>

<svelte:head>
	<title>Accessibility — ShopMate</title>
	<meta
		name="description"
		content="ShopMate accessibility: keyboard-friendly navigation, screen-reader labels, reduced-motion support, and how to report a barrier."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/accessibility" />
	<meta property="og:title" content="Accessibility — ShopMate" />
	<meta
		property="og:description"
		content="ShopMate accessibility: keyboard-friendly navigation, screen-reader labels, reduced-motion support, and how to report a barrier."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/accessibility" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Accessibility — ShopMate" />
	<meta
		name="twitter:description"
		content="ShopMate accessibility: keyboard-friendly navigation, screen-reader labels, reduced-motion support, and how to report a barrier."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Accessibility</span>
	</nav>
	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Accessibility</h1>
	<p class="mt-2 text-sm text-stone-500">Last updated: November 2026</p>

	{#each sections as section}
		<h2 class="mt-8 text-lg font-bold text-ink">{section.h}</h2>
		{#each section.paras as para}
			<p class="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{para}</p>
		{/each}
	{/each}

	<p class="mt-10 border-t border-line pt-6 text-sm text-stone-500">
		Questions? Visit the <a href="/help" class="font-semibold text-olive hover:text-olive-dark"
			>Help Center</a
		>
		or
		<a href="/contact" class="font-semibold text-olive hover:text-olive-dark">contact us</a>.
	</p>
</section>
