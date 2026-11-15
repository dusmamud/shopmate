<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { products } from '../../lib/data/products';
	import { shop, formatPrice } from '../../lib/data/store.svelte';

	const discount = (p: (typeof products)[number]) =>
		Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);

	const deals = [...products].sort((a, b) => discount(b) - discount(a));

	let added = $state(new Set<number>());

	function addToCart(id: number) {
		shop.addToCart(id);
		added.add(id);
		added = new Set(added);
		setTimeout(() => {
			added.delete(id);
			added = new Set(added);
		}, 1400);
	}

	// Countdown to midnight tonight — the sale ends when the day does.
	let remaining = $state('00:00:00');
	let timer: ReturnType<typeof setInterval> | undefined;

	function tick() {
		const now = new Date();
		const midnight = new Date(now);
		midnight.setHours(24, 0, 0, 0);
		const ms = Math.max(0, midnight.getTime() - now.getTime());
		const h = Math.floor(ms / 3_600_000);
		const m = Math.floor((ms % 3_600_000) / 60_000);
		const s = Math.floor((ms % 60_000) / 1000);
		remaining = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
	}

	onMount(() => {
		tick();
		timer = setInterval(tick, 1000);
	});
	onDestroy(() => clearInterval(timer));

	async function copyCode() {
		try {
			await navigator.clipboard.writeText('WELCOME10');
			shop.showToast('Promo code WELCOME10 copied');
		} catch {
			shop.showToast('Promo code: WELCOME10');
		}
	}
</script>

<svelte:head>
	<title>Deals — Up to 50% Off — ShopMate</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<!-- Deals hero -->
	<div class="rounded-3xl bg-cream px-6 py-10 text-center sm:px-10">
		<p class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-olive uppercase shadow-sm">
			<Icon name="tag" class="h-3.5 w-3.5" /> Limited Time
		</p>
		<h1 class="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-ink sm:text-5xl">Up to 50% Off</h1>
		<p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
			Big savings on our best sellers — but hurry, these deals end at midnight tonight.
		</p>

		<!-- Countdown -->
		<div class="mt-6 flex items-center justify-center gap-2" role="timer" aria-label="Time left in today's sale">
			<Icon name="clock" class="h-5 w-5 text-olive" />
			<span class="text-sm font-medium text-stone-500">Sale ends in</span>
			<span class="rounded-lg bg-ink px-3 py-1.5 font-mono text-lg font-bold tracking-wider text-white tabular-nums">
				{remaining}
			</span>
		</div>

		<!-- Promo code -->
		<div class="mx-auto mt-6 flex max-w-sm flex-col items-center gap-2 rounded-2xl border border-dashed border-olive/40 bg-white px-4 py-3 sm:flex-row sm:justify-between">
			<p class="text-sm text-stone-600">
				Use code <span class="font-mono text-base font-extrabold tracking-wider text-olive">WELCOME10</span> for 10% off at checkout
			</p>
			<button
				type="button"
				onclick={copyCode}
				class="shrink-0 rounded-lg bg-olive px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-olive-dark"
			>
				Copy code
			</button>
		</div>
	</div>

	<!-- Deals grid -->
	<h2 class="mt-10 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Today's Best Deals</h2>
	<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
		{#each deals as product (product.id)}
			<article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
				<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
					<img
						src={product.src}
						alt={product.name}
						loading="lazy"
						class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
					<span class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-extrabold text-white shadow">
						-{discount(product)}%
					</span>
					<button
						type="button"
						aria-label={shop.isWished(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
						aria-pressed={shop.isWished(product.id)}
						onclick={() => shop.toggleWishlist(product.id)}
						class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 {shop.isWished(product.id)
							? 'text-red-500'
							: 'text-stone-500'}"
					>
						<Icon name="heart" class="h-4 w-4 {shop.isWished(product.id) ? 'fill-red-500' : ''}" />
					</button>
				</div>

				<div class="flex flex-1 flex-col p-3 sm:p-4">
					<h3 class="text-sm font-semibold text-ink">{product.name}</h3>
					<p class="mt-1.5 flex items-center gap-1.5 text-xs text-stone-500">
						<Stars rating={product.rating} />
						<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
						<span>({product.reviews})</span>
					</p>
					<p class="mt-2 flex items-baseline gap-2">
						<span class="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
						<span class="text-xs text-stone-400 line-through">{formatPrice(product.oldPrice)}</span>
					</p>
					<button
						type="button"
						onclick={() => addToCart(product.id)}
						class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
							? 'bg-olive-dark'
							: 'bg-olive hover:bg-olive-dark'}"
					>
						<Icon name={added.has(product.id) ? 'check' : 'cart'} class="h-4 w-4" />
						{added.has(product.id) ? 'Added to Cart' : 'Add to Cart'}
					</button>
				</div>
			</article>
		{/each}
	</div>

	<p class="mt-6 text-center text-xs text-stone-400">
		Discounts shown against the original price. Promo code WELCOME10 gives an extra 10% off at checkout.
	</p>
</section>
