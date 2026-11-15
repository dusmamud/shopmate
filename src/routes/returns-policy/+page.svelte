<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	const steps = [
		{
			n: '1',
			title: 'Contact us within 30 days',
			text: 'Go to the Contact page (or reply from the Track Order page) with your order ID and the item you want to return. Tell us briefly why — it helps us improve, but it is not required.'
		},
		{
			n: '2',
			title: 'Pack it up',
			text: 'Put the item back in its original packaging, unused and in the condition it arrived in. Include any accessories, manuals and free gifts that came with it.'
		},
		{
			n: '3',
			title: 'Get your refund',
			text: 'Once we receive and check the return, your refund goes back to your original payment method within 5–7 business days. Because ShopMate is a demo store, no real payment is taken — and no real refund is processed either.'
		}
	];
</script>

<svelte:head>
	<title>Returns &amp; Refunds — ShopMate</title>
	<meta
		name="description"
		content="ShopMate returns policy: 30-day easy returns on unused items in original packaging, refunds within 5–7 business days."
	/>
	<meta property="og:title" content="Returns & Refunds — ShopMate" />
	<meta
		property="og:description"
		content="30-day easy returns, no questions asked. Unused items in original packaging, refunded within 5–7 business days."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://shopmates.pages.dev/hero.webp" />
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Returns &amp; Refunds</span>
	</nav>

	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Returns &amp; Refunds</h1>
	<p class="mt-4 text-base leading-relaxed text-stone-600">
		Changed your mind? No problem. You can return any item within <strong class="text-ink"
			>30 days of delivery</strong
		> — no questions asked — as long as it is unused and in its original packaging.
	</p>

	<div class="mt-8 space-y-4">
		{#each steps as step (step.n)}
			<article class="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6">
				<span
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-olive text-lg font-extrabold text-white"
				>
					{step.n}
				</span>
				<div>
					<h2 class="text-base font-bold text-ink">{step.title}</h2>
					<p class="mt-1.5 text-sm leading-relaxed text-stone-600">{step.text}</p>
				</div>
			</article>
		{/each}
	</div>

	<h2 class="mt-10 text-lg font-bold text-ink sm:text-xl">What can be returned?</h2>
	<ul class="mt-3 space-y-2 text-sm leading-relaxed text-stone-600 sm:text-base">
		<li class="flex gap-2">
			<Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
			<span>Any unused item in its original packaging, within 30 days of delivery.</span>
		</li>
		<li class="flex gap-2">
			<Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
			<span>
				Items bought on Deals or with a promo code are returnable too — a discount never removes
				your right to return.
			</span>
		</li>
		<li class="flex gap-2">
			<Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
			<span>
				Damaged, defective or wrong items can be returned at any time — contact us and we will
				arrange a replacement or a full refund.
			</span>
		</li>
	</ul>

	<h2 class="mt-8 text-lg font-bold text-ink sm:text-xl">What cannot be returned?</h2>
	<p class="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
		Items that have been used, worn, damaged by use, or returned without their original packaging
		cannot be accepted. If you are unsure whether your item qualifies, just ask us before sending it
		back — write to
		<a href="mailto:hello@shopmate.store" class="font-semibold text-olive underline underline-offset-2">
			hello@shopmate.store
		</a>
		or use the
		<a href="/contact" class="font-semibold text-olive underline underline-offset-2">Contact page</a>.
	</p>
</section>
