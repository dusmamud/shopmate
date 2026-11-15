<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	const values = [
		{
			icon: 'shield',
			title: 'Quality checked',
			text: 'Every product in our small, curated catalogue is checked before it is listed — and checked again before dispatch.'
		},
		{
			icon: 'tag',
			title: 'Fair prices',
			text: 'Honest prices with the real discount shown upfront. No inflated “MRP” games, no hidden fees at checkout.'
		},
		{
			icon: 'truck',
			title: 'Fast delivery',
			text: 'Free shipping on orders over $50, and most orders arrive within 3–4 business days. Track every order by its ID.'
		},
		{
			icon: 'returns',
			title: 'Easy returns',
			text: 'Changed your mind? Return anything unused within 30 days for a refund — no questions asked, no forms in triplicate.'
		}
	];

	const stats = [
		{ value: '7', label: 'Curated products' },
		{ value: '6', label: 'Categories' },
		{ value: '4.6', label: 'Average rating' },
		{ value: '30 days', label: 'Easy returns' }
	];
</script>

<svelte:head>
	<title>About Us — ShopMate</title>
	<meta
		name="description"
		content="ShopMate is a small demo store with a simple idea: quality products, honest prices, fast delivery and easy 30-day returns."
	/>
	<meta property="og:title" content="About Us — ShopMate" />
	<meta
		property="og:description"
		content="Quality products at honest prices, fast delivery and easy 30-day returns. That is the whole idea behind ShopMate."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://shopmates.pages.dev/hero.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">About Us</span>
	</nav>

	<div class="mt-6 max-w-3xl">
		<h1 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">A small store with a simple idea</h1>
		<p class="mt-4 text-base leading-relaxed text-stone-600">
			ShopMate started with a frustration we think most shoppers share: endless choice, inflated
			prices, and pages that hide the information that actually matters. So we built the opposite —
			a small, carefully chosen catalogue where every product earns its place.
		</p>
		<p class="mt-4 text-base leading-relaxed text-stone-600">
			We keep the range deliberately small: seven products across six categories, from electronics
			and fashion to home and beauty. Each one is chosen for the same reasons — solid quality, a
			fair price, and a clear description of what it is and what it is not.
		</p>
		<p class="mt-4 text-base leading-relaxed text-stone-600">
			One honest note: ShopMate is a <strong class="text-ink">demo store</strong>. Accounts, carts
			and orders live only in your browser (localStorage) — nothing is sent to a server, no real
			payment is ever taken, and no order is actually fulfilled. It exists to show what a good,
			straightforward online store feels like.
		</p>
	</div>

	<!-- Stats -->
	<div class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
		{#each stats as stat (stat.label)}
			<div class="rounded-2xl border border-line bg-white p-5 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				<p class="text-2xl font-extrabold text-olive sm:text-3xl">{stat.value}</p>
				<p class="mt-1 text-sm font-medium text-stone-500">{stat.label}</p>
			</div>
		{/each}
	</div>

	<!-- Values -->
	<h2 class="mt-12 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">What we stand for</h2>
	<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each values as value (value.title)}
			<article class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-olive-soft text-olive">
					<Icon name={value.icon} class="h-5 w-5" />
				</span>
				<h3 class="mt-4 text-base font-bold text-ink">{value.title}</h3>
				<p class="mt-2 text-sm leading-relaxed text-stone-600">{value.text}</p>
			</article>
		{/each}
	</div>

	<!-- CTA -->
	<div class="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
		<div>
			<h2 class="text-lg font-bold text-ink">See what we mean</h2>
			<p class="mt-1 text-sm text-stone-500">
				Browse the full collection — every price, review and delivery detail is shown upfront.
			</p>
		</div>
		<a
			href="/shop"
			class="inline-flex shrink-0 items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			Shop Now <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>
</section>
