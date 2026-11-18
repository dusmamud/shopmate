<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	let openIndex = $state<number | null>(0);

	const faqs = [
		{
			q: 'How do I track my order?',
			a: 'Open the Track Order page and enter your order ID (it starts with "SM" and is shown on your confirmation and in My Orders). You will see the current delivery step and the estimated delivery date.'
		},
		{
			q: 'Do I need an account to order?',
			a: 'No — you can check out as a guest. Creating a free account just makes it easier to track orders, save your address and keep a wishlist.'
		},
		{
			q: 'What payment methods do you accept?',
			a: 'We accept cash on delivery (COD), cards and UPI. This is a demo store, so no real payment is processed — choose any method at checkout.'
		},
		{
			q: 'How do I use a promo code?',
			a: 'Enter WELCOME10 for 10% off, or FREESHIP for free shipping, in the promo code box in your cart before checkout. Only one code can be applied per order.'
		},
		{
			q: 'How do I cancel an order?',
			a: 'Contact us within 1 hour of placing your order and we will cancel it for you. Once an order has shipped it can no longer be cancelled, but you can still return it within 30 days.'
		}
	];

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.q,
			acceptedAnswer: { '@type': 'Answer', text: faq.a }
		}))
	});
</script>

<svelte:head>
	<title>Help Center — ShopMate</title>
	<meta
		name="description"
		content="ShopMate Help Center: track your order, check out as a guest, pay by COD, card or UPI, use promo codes, and cancel or return within 30 days."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/help" />
	<meta property="og:title" content="Help Center — ShopMate" />
	<meta
		property="og:description"
		content="ShopMate Help Center: track your order, check out as a guest, pay by COD, card or UPI, use promo codes, and cancel or return within 30 days."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/help" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Help Center — ShopMate" />
	<meta
		name="twitter:description"
		content="ShopMate Help Center: track your order, check out as a guest, pay by COD, card or UPI, use promo codes, and cancel or return within 30 days."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Help Center</h1>
	<p class="mt-1 text-sm text-stone-500">Shipping, returns and answers to the questions we hear most.</p>

	<!-- Policy cards -->
	<div class="mt-8 grid gap-5 lg:grid-cols-2">
		<article class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-7">
			<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive">
				<Icon name="truck" class="h-5 w-5" />
			</span>
			<h2 class="mt-4 text-lg font-bold text-ink">Shipping Policy</h2>
			<ul class="mt-3 space-y-2 text-sm leading-relaxed text-stone-600">
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> Free shipping on all orders over $50 — otherwise a flat $4.99 fee applies.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> Delivery takes 3–4 business days, depending on your location.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> Your estimated delivery date is shown at checkout and on the Track Order page.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> You can track your order any time with your order ID.</li>
			</ul>
		</article>

		<article class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-7">
			<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive">
				<Icon name="returns" class="h-5 w-5" />
			</span>
			<h2 class="mt-4 text-lg font-bold text-ink">Returns &amp; Refunds</h2>
			<ul class="mt-3 space-y-2 text-sm leading-relaxed text-stone-600">
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> 30-day easy returns — no questions asked within 30 days of delivery.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> Items must be unused and in their original packaging.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> Refunds go back to your original payment method within 5–7 business days.</li>
				<li class="flex gap-2"><Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> To start a return, contact us with your order ID.</li>
			</ul>
		</article>
	</div>

	<!-- FAQ accordion -->
	<h2 class="mt-10 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Frequently Asked Questions</h2>
	<div class="mt-5 space-y-3">
		{#each faqs as faq, i (faq.q)}
			<div class="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				<button
					type="button"
					onclick={() => toggle(i)}
					aria-expanded={openIndex === i}
					class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
				>
					<span class="text-sm font-semibold text-ink sm:text-base">{faq.q}</span>
					<Icon
						name="chevron-right"
						class="h-5 w-5 shrink-0 text-olive transition-transform duration-300 {openIndex === i ? 'rotate-90' : ''}"
					/>
				</button>
				<div
					class="grid transition-all duration-500 ease-in-out {openIndex === i
						? 'grid-rows-[1fr] opacity-100'
						: 'grid-rows-[0fr] opacity-0'}"
				>
					<div class="overflow-hidden">
						<p class="px-5 pb-5 text-sm leading-relaxed text-stone-600">{faq.a}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Still need help -->
	<div class="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
		<div>
			<h2 class="text-lg font-bold text-ink">Still need help?</h2>
			<p class="mt-1 text-sm text-stone-500">Our team replies within 24 hours, Monday to Saturday, 9am–6pm.</p>
		</div>
		<a
			href="/contact"
			class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			Contact us <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>
</section>
