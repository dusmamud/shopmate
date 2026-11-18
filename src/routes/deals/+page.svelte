<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
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

	// Countdown to the end of the current sale — next Sunday 23:59 local time.
	// Boxes render "00" until onMount runs, so the prerender stays stable.
	let parts = $state({ d: '00', h: '00', m: '00', s: '00' });
	let timer: ReturnType<typeof setInterval> | undefined;

	function nextSundayEnd(): Date {
		const now = new Date();
		const end = new Date(now);
		end.setHours(23, 59, 59, 999);
		end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
		return end;
	}

	function tick() {
		const ms = Math.max(0, nextSundayEnd().getTime() - Date.now());
		const pad = (n: number) => String(n).padStart(2, '0');
		parts = {
			d: pad(Math.floor(ms / 86_400_000)),
			h: pad(Math.floor(ms / 3_600_000) % 24),
			m: pad(Math.floor(ms / 60_000) % 60),
			s: pad(Math.floor(ms / 1000) % 60)
		};
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
	<meta
		name="description"
		content="ShopMate deals — up to 50% off best sellers, with a live countdown to Sunday 11:59 PM. Use code WELCOME10 for an extra 10% off at checkout on every deal."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/deals" />
	<meta property="og:title" content="Deals — Up to 50% Off — ShopMate" />
	<meta
		property="og:description"
		content="ShopMate deals — up to 50% off best sellers, with a live countdown to Sunday 11:59 PM. Use code WELCOME10 for an extra 10% off at checkout on every deal."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/deals" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Deals — Up to 50% Off — ShopMate" />
	<meta
		name="twitter:description"
		content="ShopMate deals — up to 50% off best sellers, with a live countdown to Sunday 11:59 PM. Use code WELCOME10 for an extra 10% off at checkout on every deal."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Deals' }]} />
	<!-- Deals hero -->
	<div class="mt-4 rounded-3xl bg-cream px-6 py-10 text-center sm:px-10">
		<p class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-olive uppercase shadow-sm">
			<Icon name="tag" class="h-3.5 w-3.5" /> Limited Time
		</p>
		<h1 class="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-ink sm:text-5xl">Up to 50% Off</h1>
		<p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
			Big savings on our best sellers — but hurry, these deals end Sunday night.
		</p>

		<!-- Countdown -->
		<div class="mt-6 flex items-center justify-center gap-2 sm:gap-3" role="timer" aria-label="Time left in this week's sale">
			{#each [{ value: parts.d, label: 'Days' }, { value: parts.h, label: 'Hours' }, { value: parts.m, label: 'Mins' }, { value: parts.s, label: 'Secs' }] as box (box.label)}
				<div class="flex min-w-16 flex-col items-center rounded-xl bg-ink px-3 py-2.5 text-white shadow sm:min-w-20">
					<span class="font-mono text-xl font-bold tabular-nums sm:text-2xl">{box.value}</span>
					<span class="text-[10px] font-semibold tracking-widest text-white/70 uppercase">{box.label}</span>
				</div>
			{/each}
		</div>
		<p class="mt-3 text-xs font-medium text-stone-500">Sale ends Sunday at 11:59 PM</p>

		<!-- Promo code -->
		<div class="mx-auto mt-6 flex max-w-md flex-col items-center gap-2 rounded-2xl border border-dashed border-olive/40 bg-white px-4 py-3 sm:flex-row sm:justify-between">
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
		{#each deals as product, i (product.id)}
			<article style="--i: {i}" class="card-in group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
				<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
					<img
						src={product.src}
						srcset={product.src.includes('backpack') || product.src.includes('headphones')
							? `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src.replace('.webp', '-1200.webp')} 1200w, ${product.src} 1600w`
							: `${product.src.replace('.webp', '-400.webp')} 400w, ${product.src.replace('.webp', '-800.webp')} 800w, ${product.src} ${product.src.includes('lamp') || product.src.includes('tshirt') ? 1120 : 912}w`}
						sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 240px"
						alt={product.name}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
					<span class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-extrabold text-white shadow">
						-{discount(product)}%
					</span>
					{#if product.isNew}
						<span class="absolute top-12 left-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase shadow">
							New
						</span>
					{/if}
					<button
						type="button"
						aria-label={`Quick view ${product.name}`}
						onclick={() => shop.openQuickView(product.id)}
						class="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-500 shadow transition hover:scale-110"
					>
						<Icon name="eye" class="h-5 w-5" />
					</button>
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
					<p class="mt-1.5 flex items-center gap-1 text-xs text-stone-500">
						<Stars rating={product.rating} class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
						<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
						<span>({product.reviews})</span>
					</p>
					<p class="mt-2 flex items-baseline gap-2">
						<span class="text-base font-extrabold text-ink">{formatPrice(product.price)}</span>
						<span class="text-xs text-stone-500 line-through">{formatPrice(product.oldPrice)}</span>
					</p>
					<button
						type="button"
						onclick={() => addToCart(product.id)}
						class="press mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition {added.has(product.id)
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

	<p class="mt-6 text-center text-xs text-stone-500">
		Discounts shown against the original price. Promo code WELCOME10 gives an extra 10% off at checkout.
	</p>
</section>
