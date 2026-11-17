<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { reveal } from '../../../lib/actions/reveal';
	import { getProduct, relatedProducts, type Review } from '../../../lib/data/products';
	import { shop, formatDate, formatPrice } from '../../../lib/data/store.svelte';

	const product = $derived(getProduct(Number(page.params.id)));
	const related = $derived(product ? relatedProducts(product.id) : []);
	const recent = $derived(
		product ? shop.recentProducts.filter((p) => p.id !== product!.id).slice(0, 4) : []
	);

	let qty = $state(1);
	let selectedVariant = $state('');
	let activeImg = $state(0);
	let lightbox = $state(false);
	let tab = $state<'description' | 'specs' | 'reviews' | 'qa'>('description');

	let pincode = $state('');
	let pinMsg = $state('');
	let pinOk = $state(false);

	let reviewSort = $state<'newest' | 'highest' | 'lowest'>('newest');
	let reviewName = $state('');
	let reviewRating = $state(5);
	let reviewTitle = $state('');
	let reviewText = $state('');

	let lightboxCloseBtn: HTMLButtonElement | undefined = $state();

	let askQuestion = $state('');
	let extraQuestions = $state<{ q: string }[]>([]);
	let sizeGuideOpen = $state(false);
	let reviewFilter = $state(0); // 0 = all ratings, else 1–5 stars
	let helpfulVoted = $state<Set<string>>(new Set());
	let fbtSelected = $state<Set<number>>(new Set());

	const jsonLd = $derived(
		product
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Product',
					name: product.name,
					image: 'https://shopmates.pages.dev' + product.src,
					description: product.desc,
					brand: { '@type': 'Brand', name: 'ShopMate' },
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: product.rating,
						reviewCount: product.reviews
					},
					offers: {
						'@type': 'Offer',
						priceCurrency: 'USD',
						price: product.price,
						availability: 'https://schema.org/InStock'
					}
				})
			: ''
	);

	/** Size chart for products sold by size (shoes, apparel). */
	const sizeGuide = $derived.by(() => {
		if (!product) return null;
		if (product.id === 4)
			return {
				title: 'Running Shoes — UK size guide',
				note: 'Measure your foot in the evening and match the length below. Between sizes? Go half a size up.',
				cols: ['UK', 'EU', 'Foot length'],
				rows: [
					['6', '40', '25.0 cm'],
					['7', '41', '25.7 cm'],
					['8', '42', '26.4 cm'],
					['9', '43', '27.1 cm'],
					['10', '44', '27.8 cm']
				]
			};
		if (product.id === 6)
			return {
				title: 'Classic Cotton T-Shirt — size guide',
				note: 'Chest measured flat across, armpit to armpit. Regular fit — size up for a relaxed look.',
				cols: ['Size', 'Chest', 'Length'],
				rows: [
					['S', '38"', '27"'],
					['M', '40"', '28"'],
					['L', '42"', '29"'],
					['XL', '44"', '30"']
				]
			};
		return null;
	});

	/** Frequently bought together: this product + top 2 related. */
	const fbtItems = $derived(product ? relatedProducts(product.id, 2) : []);
	const fbtTotal = $derived(
		product
			? product.price +
				fbtItems.filter((p) => fbtSelected.has(p.id)).reduce((n, p) => n + p.price, 0)
			: 0
	);
	const fbtCount = $derived(1 + fbtItems.filter((p) => fbtSelected.has(p.id)).length);

	const savePct = $derived(
		product ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0
	);
	const images = $derived(product?.images ?? []);
	const allReviews = $derived(product ? shop.getReviews(product.id) : []);
	const sortedReviews = $derived.by(() => {
		let list = [...allReviews];
		if (reviewFilter > 0) list = list.filter((r) => r.rating === reviewFilter);
		if (reviewSort === 'highest') list.sort((a, b) => b.rating - a.rating);
		if (reviewSort === 'lowest') list.sort((a, b) => a.rating - b.rating);
		return list;
	});
	const breakdown = $derived.by(() => {
		const counts = [0, 0, 0, 0, 0];
		for (const r of allReviews) counts[Math.max(1, Math.min(5, r.rating)) - 1]++;
		return [5, 4, 3, 2, 1].map((star) => ({
			star,
			count: counts[star - 1],
			pct: allReviews.length ? Math.round((counts[star - 1] / allReviews.length) * 100) : 0
		}));
	});
	const deliveryDate = $derived(formatDate(Date.now() + 3 * 24 * 3_600_000));

	// Reset per-product UI whenever the product changes (e.g. via related links).
	$effect(() => {
		const p = product;
		if (!p) return;
		qty = 1;
		selectedVariant = p.option.choices[0];
		activeImg = 0;
		tab = 'description';
		reviewSort = 'newest';
		reviewFilter = 0;
		fbtSelected = new Set(relatedProducts(p.id, 2).map((x) => x.id));
	});

	// Lightbox: ESC / arrows + scroll lock while open.
	$effect(() => {
		if (!lightbox) return;
		const onKey = (e: KeyboardEvent) => {
			const n = images.length;
			if (e.key === 'Escape') lightbox = false;
			if (e.key === 'ArrowRight' && n) activeImg = (activeImg + 1) % n;
			if (e.key === 'ArrowLeft' && n) activeImg = (activeImg - 1 + n) % n;
		};
		window.addEventListener('keydown', onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		lightboxCloseBtn?.focus();
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prev;
		};
	});

	onMount(() => {
		if (product) {
			shop.trackView(product.id);
			reviewName = shop.user?.name ?? '';
		}
		try {
			helpfulVoted = new Set(
				JSON.parse(localStorage.getItem('shopmate_helpful') ?? '[]') as string[]
			);
		} catch {
			helpfulVoted = new Set();
		}
	});

	// Size guide modal: ESC + scroll lock while open.
	$effect(() => {
		if (!sizeGuideOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') sizeGuideOpen = false;
		};
		window.addEventListener('keydown', onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = prev;
		};
	});

	function helpfulKey(r: Review) {
		return `${product?.id ?? 0}:${r.name}:${r.title}`;
	}

	function helpfulCount(r: Review) {
		return (r.helpful ?? 0) + (helpfulVoted.has(helpfulKey(r)) ? 1 : 0);
	}

	function toggleHelpful(r: Review) {
		const key = helpfulKey(r);
		if (helpfulVoted.has(key)) helpfulVoted.delete(key);
		else helpfulVoted.add(key);
		helpfulVoted = new Set(helpfulVoted);
		try {
			localStorage.setItem('shopmate_helpful', JSON.stringify([...helpfulVoted]));
		} catch {
			// Storage unavailable — the in-memory vote still shows.
		}
	}

	function toggleFbt(id: number) {
		if (fbtSelected.has(id)) fbtSelected.delete(id);
		else fbtSelected.add(id);
		fbtSelected = new Set(fbtSelected);
	}

	function addFbt() {
		if (!product) return;
		shop.addToCart(product.id, 1, { variant: selectedVariant, silent: true });
		for (const item of fbtItems) {
			if (fbtSelected.has(item.id)) shop.addToCart(item.id, 1, { silent: true });
		}
		shop.openCart();
	}

	function stepQty(delta: number) {
		if (!product) return;
		qty = Math.min(product.stock, Math.max(1, qty + delta));
	}

	function stepImage(delta: number) {
		const n = images.length;
		if (!n) return;
		activeImg = (activeImg + delta + n) % n;
	}

	function addToCart() {
		if (!product) return;
		shop.addToCart(product.id, qty, { variant: selectedVariant });
	}

	function buyNow() {
		if (!product) return;
		shop.addToCart(product.id, qty, { variant: selectedVariant, silent: true });
		goto('/checkout');
	}

	function checkPincode() {
		pinOk = false;
		if (!/^\d{6}$/.test(pincode.trim())) {
			pinMsg = 'Please enter a valid 6-digit pincode.';
			return;
		}
		pinOk = true;
		pinMsg = `Delivering to ${pincode.trim()} — get it by ${deliveryDate} · Free delivery`;
	}

	async function shareProduct() {
		if (!product) return;
		const url = `${window.location.origin}/product/${product.id}`;
		try {
			await navigator.clipboard.writeText(url);
			shop.showToast('Product link copied to clipboard');
		} catch {
			shop.showToast('Copy this link: ' + url);
		}
	}

	function submitReview() {
		if (!product) return;
		if (!reviewTitle.trim() || !reviewText.trim()) {
			shop.showToast('Please add a title and a few words about the product');
			return;
		}
		const review: Omit<Review, 'date'> = {
			name: reviewName.trim() || 'Guest',
			rating: reviewRating,
			title: reviewTitle.trim(),
			text: reviewText.trim()
		};
		shop.addReview(product.id, review);
		reviewTitle = '';
		reviewText = '';
		reviewSort = 'newest';
		shop.showToast('Thanks! Your review was added');
	}

	function submitQuestion() {
		if (!askQuestion.trim()) return;
		extraQuestions = [{ q: askQuestion.trim() }, ...extraQuestions];
		askQuestion = '';
		shop.showToast('Question submitted — the seller will answer soon');
	}
</script>

<svelte:head>
	<title>{product ? `${product.name} — ShopMate` : 'Product not found — ShopMate'}</title>
	{#if product}
		<meta name="description" content={product.desc} />
		<meta property="og:title" content="{product.name} — ShopMate" />
		<meta property="og:description" content={product.desc} />
		<meta property="og:image" content={'https://shopmates.pages.dev' + product.src} />
		<meta property="og:type" content="product" />
		<meta name="twitter:card" content="summary_large_image" />
		{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{/if}
</svelte:head>

{#if !product}
	<div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
		<Icon name="alert" class="mx-auto h-12 w-12 text-stone-300" />
		<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink">Product not found</h1>
		<p class="mt-2 text-sm text-stone-500">This product does not exist or was removed.</p>
		<a
			href="/shop"
			class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			Browse All Products <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>
{:else}
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
			<a href="/" class="hover:text-olive">Home</a>
			<span class="mx-1.5">/</span>
			<a href="/shop?category={encodeURIComponent(product.category)}" class="hover:text-olive">
				{product.category}
			</a>
			<span class="mx-1.5">/</span>
			<span class="font-medium text-ink">{product.name}</span>
		</nav>

		<div class="mt-5 grid gap-8 lg:grid-cols-2">
			<!-- Gallery -->
			<div class="min-w-0">
				<div class="group relative overflow-hidden rounded-2xl border border-line bg-[#f6f1e7]">
					<button
						type="button"
						onclick={() => (lightbox = true)}
						aria-label="View larger image"
						class="block aspect-square w-full cursor-zoom-in"
					>
						<img
							src={images[activeImg] ?? product.src}
							alt={product.name}
							class="aspect-square w-full object-cover"
						/>
					</button>
					{#if images.length > 1}
						<button
							type="button"
							onclick={() => stepImage(-1)}
							aria-label="Previous image"
							class="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
						>
							<Icon name="chevron-left" class="h-5 w-5" />
						</button>
						<button
							type="button"
							onclick={() => stepImage(1)}
							aria-label="Next image"
							class="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-white"
						>
							<Icon name="chevron-right" class="h-5 w-5" />
						</button>
					{/if}
					<span
						class="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white"
					>
						<Icon name="search" class="h-3.5 w-3.5" /> Tap image to zoom
					</span>
					{#if savePct > 0}
						<span
							class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-bold text-white"
						>
							{savePct}% OFF
						</span>
					{/if}
				</div>
				{#if images.length > 1}
					<div class="mt-3 flex gap-3">
						{#each images as src, i (src)}
							<button
								type="button"
								onclick={() => (activeImg = i)}
								aria-label="View image {i + 1}"
								aria-pressed={activeImg === i}
								class="h-20 w-20 overflow-hidden rounded-xl border-2 transition {activeImg === i
									? 'border-olive'
									: 'border-line opacity-70 hover:opacity-100'}"
							>
								<img src={src} alt="" class="h-full w-full object-cover" />
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Buy box -->
			<div class="min-w-0">
				<p class="text-xs font-bold tracking-widest text-olive uppercase">{product.category}</p>
				<h1 class="mt-2 text-[1.4rem] leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">
					{product.name}
				</h1>
				<button
					type="button"
					onclick={() => (tab = 'reviews')}
					class="mt-2 flex items-center gap-2 text-sm text-stone-500 transition hover:text-olive"
				>
					<Stars rating={product.rating} class="h-4 w-4" />
					<span class="font-semibold text-ink">{product.rating.toFixed(1)}</span>
					<span class="underline underline-offset-2">({product.reviews} reviews)</span>
				</button>

				<p class="mt-4 flex flex-wrap items-baseline gap-3">
					<span class="text-3xl font-extrabold text-ink">{formatPrice(product.price)}</span>
					<span class="text-base text-stone-400 line-through"
						>{formatPrice(product.oldPrice)}</span
					>
					<span class="rounded-full bg-olive-soft px-2.5 py-1 text-xs font-bold text-olive">
						Save {savePct}%
					</span>
					<span class="text-xs text-stone-500">Inclusive of all taxes</span>
				</p>

				<ul class="mt-4 space-y-1.5 text-sm text-stone-600">
					{#each product.highlights as h (h)}
						<li class="flex items-start gap-2">
							<Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
							<span>{h}</span>
						</li>
					{/each}
				</ul>

				<!-- Variant selector (buttons, not a dropdown) -->
				<div class="mt-6">
					<div class="flex items-center justify-between gap-3">
						<p class="text-sm font-semibold text-ink">
							{product.option.label}:
							<span class="font-normal text-stone-600">{selectedVariant}</span>
						</p>
						{#if sizeGuide}
							<button
								type="button"
								onclick={() => (sizeGuideOpen = true)}
								class="text-xs font-semibold text-olive underline underline-offset-2"
							>
								Size guide
							</button>
						{/if}
					</div>
					<div class="mt-2.5 flex flex-wrap gap-2" role="group" aria-label={product.option.label}>
						{#each product.option.choices as choice (choice)}
							<button
								type="button"
								onclick={() => (selectedVariant = choice)}
								aria-pressed={selectedVariant === choice}
								class="min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition {selectedVariant ===
								choice
									? 'border-olive bg-olive text-white'
									: 'border-line bg-white text-ink hover:border-olive'}"
							>
								{choice}
							</button>
						{/each}
					</div>
				</div>

				<p class="mt-5 flex items-center gap-2 text-sm font-medium">
					{#if product.stock > 0}
						<span class="h-2.5 w-2.5 rounded-full bg-green-500"></span>
						<span class="text-green-700">In stock</span>
						{#if product.stock <= 15}
							<span class="font-semibold text-amber-600">· Only {product.stock} left — order soon</span>
						{:else}
							<span class="text-stone-400">· {product.stock} available</span>
						{/if}
					{:else}
						<span class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
						<span class="text-red-600">Out of stock</span>
					{/if}
				</p>

				<p class="mt-2 text-xs text-stone-500">
					Sold &amp; shipped by <span class="font-semibold text-ink">ShopMate</span> · Free returns
					within 30 days
				</p>

				<div class="mt-5 flex flex-wrap items-center gap-3">
					<div class="flex items-center rounded-lg border border-line bg-white">
						<button
							type="button"
							onclick={() => stepQty(-1)}
							disabled={qty <= 1}
							aria-label="Decrease quantity"
							class="flex h-11 w-11 items-center justify-center text-ink transition hover:text-olive disabled:opacity-40"
						>
							<Icon name="minus" class="h-4 w-4" />
						</button>
						<span class="w-10 text-center text-sm font-bold text-ink" aria-live="polite">{qty}</span>
						<button
							type="button"
							onclick={() => stepQty(1)}
							disabled={qty >= product.stock}
							aria-label="Increase quantity"
							class="flex h-11 w-11 items-center justify-center text-ink transition hover:text-olive disabled:opacity-40"
						>
							<Icon name="plus" class="h-4 w-4" />
						</button>
					</div>
					<button
						type="button"
						onclick={() => shop.toggleWishlist(product.id)}
						aria-pressed={shop.isWished(product.id)}
						class="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white transition hover:border-olive {shop.isWished(product.id)
							? 'text-red-500'
							: 'text-stone-500'}"
						aria-label={shop.isWished(product.id) ? 'Remove from wishlist' : 'Save to wishlist'}
					>
						<Icon name="heart" class="h-5 w-5 {shop.isWished(product.id) ? 'fill-red-500' : ''}" />
					</button>
					<button
						type="button"
						onclick={shareProduct}
						class="flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-stone-600 transition hover:border-olive hover:text-olive"
					>
						<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>
						Share
					</button>
					<button
						type="button"
						onclick={() => shop.toggleCompare(product.id)}
						aria-pressed={shop.isCompared(product.id)}
						class="flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold transition hover:border-olive {shop.isCompared(product.id)
							? 'text-olive'
							: 'text-stone-600 hover:text-olive'}"
					>
						<Icon name={shop.isCompared(product.id) ? 'check' : 'sliders'} class="h-4 w-4" />
						{shop.isCompared(product.id) ? 'Added to Compare' : 'Compare'}
					</button>
				</div>

				<div class="mt-4 flex flex-col gap-3 sm:flex-row">
					<button
						type="button"
						onclick={addToCart}
						disabled={product.stock <= 0}
						class="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark disabled:opacity-50"
					>
						<Icon name="cart" class="h-4 w-4" /> Add to Cart
					</button>
					<button
						type="button"
						onclick={buyNow}
						disabled={product.stock <= 0}
						class="press flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-olive px-5 py-3 text-sm font-semibold text-olive transition hover:bg-olive-soft disabled:opacity-50"
					>
						Buy Now <Icon name="arrow-right" class="h-4 w-4" />
					</button>
				</div>

				<!-- Delivery check -->
				<div class="mt-6 rounded-2xl border border-line bg-white p-4">
					<p class="flex items-center gap-2 text-sm font-semibold text-ink">
						<Icon name="pin" class="h-4 w-4 text-olive" /> Check delivery
					</p>
					<div class="mt-3 flex gap-2">
						<label class="sr-only" for="pincode">Pincode</label>
						<input
							id="pincode"
							bind:value={pincode}
							inputmode="numeric"
							maxlength="6"
							placeholder="Enter 6-digit pincode"
							class="min-w-0 flex-1 rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
						/>
						<button
							type="button"
							onclick={checkPincode}
							class="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
						>
							Check
						</button>
					</div>
					{#if pinMsg}
						<p class="mt-2.5 flex items-start gap-1.5 text-sm {pinOk ? 'text-green-700' : 'text-red-600'}">
							<Icon name={pinOk ? 'check-circle' : 'alert'} class="mt-0.5 h-4 w-4 shrink-0" />
							<span>{pinMsg}</span>
						</p>
					{:else}
						<p class="mt-2.5 text-xs text-stone-500">
							Usually delivered in 3–4 days · Free delivery on orders over $50
						</p>
					{/if}
				</div>

				<!-- Offers -->
				<div class="mt-4 rounded-2xl border border-dashed border-olive/50 bg-olive-soft/60 p-4">
					<p class="flex items-center gap-2 text-sm font-semibold text-ink">
						<Icon name="tag" class="h-4 w-4 text-olive" /> Available offers
					</p>
					<ul class="mt-2.5 space-y-1.5 text-sm text-stone-600">
						<li>· <strong class="text-ink">WELCOME10</strong> — 10% off your first order</li>
						<li>· <strong class="text-ink">FREESHIP</strong> — free shipping, no minimum</li>
						<li>· Cash on Delivery available · EMI from {formatPrice(product.price / 6)}/month</li>
					</ul>
				</div>

				<div class="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
					<div>
						<Icon name="truck" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">Free shipping over $50</p>
					</div>
					<div>
						<Icon name="returns" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">30-day returns</p>
					</div>
					<div>
						<Icon name="shield" class="mx-auto h-5 w-5 text-olive" />
						<p class="mt-1.5 text-xs font-semibold text-ink">Secure payment</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Frequently bought together -->
		{#if fbtItems.length > 0}
			<section
			class="mt-12 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6"
			use:reveal
		>
				<h2 class="text-lg font-extrabold tracking-tight text-ink">Frequently Bought Together</h2>
				<div class="mt-4 flex flex-wrap items-center gap-3">
					<a href="/product/{product.id}" class="block h-20 w-20 overflow-hidden rounded-xl bg-[#f6f1e7]">
						<img src={product.src} alt={product.name} class="h-full w-full object-cover" />
					</a>
					{#each fbtItems as item (item.id)}
						<span class="text-xl font-bold text-stone-300" aria-hidden="true">+</span>
						<a href="/product/{item.id}" class="block h-20 w-20 overflow-hidden rounded-xl bg-[#f6f1e7]">
							<img src={item.src} alt={item.name} class="h-full w-full object-cover" />
						</a>
					{/each}
				</div>
				<ul class="mt-4 space-y-2.5 text-sm">
					<li class="flex items-center gap-2.5">
						<Icon name="check-circle" class="h-5 w-5 shrink-0 text-olive" />
						<span class="font-semibold text-ink">{product.name}</span>
						<span class="ml-auto font-bold text-ink">{formatPrice(product.price)}</span>
					</li>
					{#each fbtItems as item (item.id)}
						<li class="flex items-center gap-2.5">
							<input
								type="checkbox"
								id="fbt-{item.id}"
								checked={fbtSelected.has(item.id)}
								onchange={() => toggleFbt(item.id)}
								class="h-5 w-5 shrink-0 accent-[#5c7038]"
							/>
							<label for="fbt-{item.id}" class="min-w-0 flex-1 cursor-pointer">
								<span class="font-semibold text-ink hover:text-olive">{item.name}</span>
							</label>
							<span class="font-bold text-ink">{formatPrice(item.price)}</span>
						</li>
					{/each}
				</ul>
				<div class="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
					<p class="text-sm text-stone-600">
						Total for <span class="font-bold text-ink">{fbtCount} item{fbtCount === 1 ? '' : 's'}</span>:
						<span class="text-base font-extrabold text-ink">{formatPrice(fbtTotal)}</span>
					</p>
					<button
						type="button"
						onclick={addFbt}
						class="flex items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						<Icon name="cart" class="h-4 w-4" /> Add {fbtCount} item{fbtCount === 1 ? '' : 's'} to Cart
					</button>
				</div>
			</section>
		{/if}

		<!-- Tabs: Description / Specifications / Reviews / Q&A -->
		<section class="mt-12" use:reveal>
			<div class="no-scrollbar flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Product information">
				{#each [['description', 'Description'], ['specs', 'Specifications'], ['reviews', `Reviews (${product.reviews + (allReviews.length - product.seedReviews.length)})`], ['qa', 'Q&A']] as [key, label] (key)}
					<button
						type="button"
						role="tab"
						aria-selected={tab === key}
						onclick={() => (tab = key as typeof tab)}
						class="min-h-11 shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition {tab ===
						key
							? 'border-olive text-olive'
							: 'border-transparent text-stone-500 hover:text-ink'}"
					>
						{label}
					</button>
				{/each}
			</div>

			{#if tab === 'description'}
				<div class="max-w-3xl py-6">
					<p class="text-sm leading-relaxed text-stone-600 sm:text-base">{product.desc}</p>
					<p class="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
						Every ShopMate product is checked before dispatch and ships in protective packaging.
						If anything arrives damaged or not as described, you can return it within 30 days for a
						full refund — no questions asked. See the <a href="/help" class="font-semibold text-olive underline underline-offset-2">Help centre</a> for shipping and returns.
					</p>
				</div>
			{:else if tab === 'specs'}
				<div class="max-w-3xl py-6">
					<table class="w-full text-sm">
						<tbody>
							{#each product.specs as row, i (row.label)}
								<tr class={i % 2 === 0 ? 'bg-cream/60' : 'bg-white'}>
									<th scope="row" class="w-40 px-4 py-3 text-left font-semibold text-ink sm:w-56"
										>{row.label}</th
									>
									<td class="px-4 py-3 text-stone-600">{row.value}</td>
								</tr>
							{/each}
							<tr class="bg-white">
								<th scope="row" class="w-40 px-4 py-3 text-left font-semibold text-ink sm:w-56"
									>Category</th
								>
								<td class="px-4 py-3 text-stone-600">{product.category}</td>
							</tr>
						</tbody>
					</table>
				</div>
			{:else if tab === 'reviews'}
				<div class="grid gap-8 py-6 lg:grid-cols-[280px_1fr]">
					<div>
						<p class="flex items-end gap-2">
							<span class="text-5xl font-extrabold text-ink">{product.rating.toFixed(1)}</span>
							<span class="pb-1.5 text-sm text-stone-500">/ 5</span>
						</p>
						<p class="mt-1.5"><Stars rating={product.rating} class="h-4 w-4" /></p>
						<p class="mt-1.5 text-sm text-stone-500">
							Based on {product.reviews} ratings
						</p>
						<div class="mt-4 space-y-2">
							{#each breakdown as row (row.star)}
								<div class="flex items-center gap-2 text-xs">
									<span class="w-6 shrink-0 font-semibold text-ink">{row.star}★</span>
									<div class="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
										<div class="h-full rounded-full bg-olive" style="width: {row.pct}%"></div>
									</div>
									<span class="w-8 shrink-0 text-right text-stone-500">{row.count}</span>
								</div>
							{/each}
						</div>
						<p class="mt-3 text-[11px] text-stone-400">
							Breakdown from the {allReviews.length} reviews shown below.
						</p>
					</div>
					<div>
						<div class="flex flex-wrap items-center justify-between gap-3">
							<h3 class="text-base font-bold text-ink">Customer reviews</h3>
							<label class="flex items-center gap-2 text-sm text-stone-500">
								Sort by
								<select
									bind:value={reviewSort}
									class="rounded-lg border border-line bg-white px-2.5 py-2 text-sm font-medium text-ink outline-none focus:border-olive"
								>
									<option value="newest">Newest first</option>
									<option value="highest">Highest rated</option>
									<option value="lowest">Lowest rated</option>
								</select>
							</label>
						</div>
						<div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter reviews by rating">
							{#each [0, 5, 4, 3, 2, 1] as star (star)}
								<button
									type="button"
									onclick={() => (reviewFilter = star)}
									aria-pressed={reviewFilter === star}
									class="min-h-9 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition {reviewFilter ===
									star
										? 'border-olive bg-olive text-white'
										: 'border-line bg-white text-ink hover:border-olive'}"
								>
									{star === 0 ? 'All ratings' : `${star}★`}
								</button>
							{/each}
						</div>
						{#if sortedReviews.length === 0}
							<p class="mt-6 rounded-xl bg-cream px-4 py-6 text-center text-sm text-stone-500">
								No {reviewFilter}★ reviews yet — try another rating or be the first to write one below.
							</p>
						{/if}
						<ul class="mt-4 divide-y divide-line">
							{#each sortedReviews as r (r.name + r.title)}
								<li class="py-4">
									<p class="flex items-center gap-2">
										<Stars rating={r.rating} class="h-3.5 w-3.5" />
										<span class="text-sm font-bold text-ink">{r.title}</span>
									</p>
									<p class="mt-1.5 text-sm leading-relaxed text-stone-600">{r.text}</p>
									<p class="mt-1.5 text-xs text-stone-400">{r.name} · {r.date}</p>
									<button
										type="button"
										onclick={() => toggleHelpful(r)}
										aria-pressed={helpfulVoted.has(helpfulKey(r))}
										class="mt-2.5 flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition {helpfulVoted.has(helpfulKey(r))
											? 'border-olive bg-olive-soft text-olive'
											: 'border-line bg-white text-stone-500 hover:border-olive hover:text-olive'}"
									>
										<Icon name="check" class="h-3.5 w-3.5" />
										Helpful ({helpfulCount(r)})
									</button>
								</li>
							{/each}
						</ul>

						<form
							class="mt-6 rounded-2xl border border-line bg-cream/50 p-4 sm:p-5"
							onsubmit={(e) => {
								e.preventDefault();
								submitReview();
							}}
						>
							<h4 class="text-sm font-bold text-ink">Write a review</h4>
							<p class="mt-1 text-xs text-stone-500">
								Your review is saved on this device (demo store — no account needed).
							</p>
							<div class="mt-4 grid gap-3 sm:grid-cols-2">
								<div>
									<label for="review-name" class="text-xs font-semibold text-ink">Your name</label>
									<input
										id="review-name"
										bind:value={reviewName}
										placeholder="Your name"
										class="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
									/>
								</div>
								<div>
									<span class="text-xs font-semibold text-ink">Your rating</span>
									<div class="mt-1.5 flex items-center gap-1" role="radiogroup" aria-label="Your rating">
										{#each [1, 2, 3, 4, 5] as star (star)}
											<button
												type="button"
												role="radio"
												aria-checked={reviewRating === star}
												aria-label="{star} star{star > 1 ? 's' : ''}"
												onclick={() => (reviewRating = star)}
												class="flex h-11 w-11 items-center justify-center"
											>
												<Icon
													name="star"
													class="h-6 w-6 {star <= reviewRating
														? 'fill-amber-400 text-amber-400'
														: 'text-stone-300'}"
												/>
											</button>
										{/each}
									</div>
								</div>
							</div>
							<div class="mt-3">
								<label for="review-title" class="text-xs font-semibold text-ink">Review title</label>
								<input
									id="review-title"
									bind:value={reviewTitle}
									placeholder="Sum it up in a line"
									class="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
								/>
							</div>
							<div class="mt-3">
								<label for="review-text" class="text-xs font-semibold text-ink">Your review</label>
								<textarea
									id="review-text"
									bind:value={reviewText}
									rows="3"
									placeholder="What did you like? How is the quality, fit, battery…?"
									class="mt-1.5 w-full resize-y rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
								></textarea>
							</div>
							<button
								type="submit"
								class="mt-4 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
							>
								Submit Review
							</button>
						</form>
					</div>
				</div>
			{:else if tab === 'qa'}
				<div class="max-w-3xl py-6">
					<ul class="divide-y divide-line">
						{#each product.qa as item (item.q)}
							<li class="py-4">
								<p class="text-sm font-semibold text-ink">Q: {item.q}</p>
								<p class="mt-1.5 text-sm leading-relaxed text-stone-600">A: {item.a}</p>
							</li>
						{/each}
						{#each extraQuestions as item (item.q)}
							<li class="py-4">
								<p class="text-sm font-semibold text-ink">Q: {item.q}</p>
								<p class="mt-1.5 text-sm text-stone-500">
									<span
										class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700"
										>Awaiting answer</span
									>
									<span class="ml-2">The seller usually answers within 24 hours.</span>
								</p>
							</li>
						{/each}
					</ul>
					<form
						class="mt-4 flex flex-col gap-2 sm:flex-row"
						onsubmit={(e) => {
							e.preventDefault();
							submitQuestion();
						}}
					>
						<label class="sr-only" for="ask-q">Ask a question about this product</label>
						<input
							id="ask-q"
							bind:value={askQuestion}
							placeholder="Ask a question about this product…"
							class="min-w-0 flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
						/>
						<button
							type="submit"
							class="rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
						>
							Ask Question
						</button>
					</form>
				</div>
			{/if}
		</section>

		{#if recent.length > 0}
			<section class="mt-12">
				<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Recently Viewed</h2>
				<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{#each recent as item (item.id)}
						<article class="group overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
							<a href="/product/{item.id}" class="block aspect-square overflow-hidden bg-[#f6f1e7]">
								<img
									src={item.src}
									alt={item.name}
									loading="lazy"
									class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								/>
							</a>
							<div class="p-3 sm:p-4">
								<h3 class="text-sm font-semibold text-ink">
									<a href="/product/{item.id}" class="hover:text-olive">{item.name}</a>
								</h3>
								<p class="mt-2 text-base font-extrabold text-ink">{formatPrice(item.price)}</p>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}

		{#if related.length > 0}
			<section class="mt-14" use:reveal>
				<h2 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">You May Also Like</h2>
				<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
					{#each related as rel (rel.id)}
						<article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
							<div class="relative aspect-square overflow-hidden bg-[#f6f1e7]">
								<a href="/product/{rel.id}" aria-label={rel.name} class="block h-full w-full">
									<img
										src={rel.src}
										alt={rel.name}
										loading="lazy"
										class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</a>
								{#if rel.isNew}
									<span
										class="absolute top-3 left-3 rounded-full bg-olive px-2.5 py-1 text-xs font-extrabold text-white shadow"
									>
										New
									</span>
								{/if}
								<button
									type="button"
									aria-label={shop.isWished(rel.id) ? `Remove ${rel.name} from wishlist` : `Save ${rel.name} to wishlist`}
									aria-pressed={shop.isWished(rel.id)}
									onclick={() => shop.toggleWishlist(rel.id)}
									class="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow transition hover:scale-110 {shop.isWished(rel.id)
										? 'text-red-500'
										: 'text-stone-500'}"
								>
									<Icon name="heart" class="h-4 w-4 {shop.isWished(rel.id) ? 'fill-red-500' : ''}" />
								</button>
								<button
									type="button"
									aria-label="Quick view {rel.name}"
									onclick={() => shop.openQuickView(rel.id)}
									class="absolute bottom-3 left-3 flex h-9 items-center gap-1.5 rounded-full bg-white/95 px-3 text-xs font-semibold text-ink opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100"
								>
									<Icon name="eye" class="h-4 w-4" /> Quick View
								</button>
							</div>
							<div class="flex flex-1 flex-col p-3 sm:p-4">
								<h3 class="text-sm font-semibold text-ink">
									<a href="/product/{rel.id}" class="hover:text-olive">{rel.name}</a>
								</h3>
								<p class="mt-1.5 flex items-center gap-1 text-xs text-stone-500">
									<Stars rating={rel.rating} />
									<span class="font-semibold text-ink">{rel.rating.toFixed(1)}</span>
									<span>({rel.reviews})</span>
								</p>
								<p class="mt-2 flex items-baseline gap-2">
									<span class="text-base font-extrabold text-ink">{formatPrice(rel.price)}</span>
									<span class="text-xs text-stone-400 line-through"
										>{formatPrice(rel.oldPrice)}</span
									>
								</p>
								<button
									type="button"
									onclick={() => shop.addToCart(rel.id)}
									class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
								>
									<Icon name="cart" class="h-4 w-4" /> Add to Cart
								</button>
							</div>
						</article>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<!-- Sticky mobile Add-to-Cart bar (sits above the bottom nav, h-14) -->
	<div
		class="fixed inset-x-0 bottom-14 z-40 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden"
	>
		<img src={product.src} alt="" class="h-10 w-10 rounded-lg object-cover" />
		<div class="min-w-0 flex-1">
			<p class="truncate text-xs font-semibold text-ink">{product.name}</p>
			<p class="text-sm font-extrabold text-ink">
				{formatPrice(product.price)}
				<span class="ml-1 text-xs font-normal text-stone-400 line-through"
					>{formatPrice(product.oldPrice)}</span
				>
			</p>
		</div>
		<button
			type="button"
			onclick={addToCart}
			class="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-olive px-5 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			<Icon name="cart" class="h-4 w-4" /> Add to Cart
		</button>
	</div>

	<!-- Size guide modal -->
	{#if sizeGuideOpen && sizeGuide}
		<div class="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={sizeGuide.title}>
			<button
				type="button"
				aria-label="Close size guide"
				onclick={() => (sizeGuideOpen = false)}
				class="absolute inset-0 cursor-default bg-black/60"
			></button>
			<div class="relative w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
				<div class="flex items-start justify-between gap-3">
					<h2 class="text-lg font-extrabold text-ink">{sizeGuide.title}</h2>
					<button
						type="button"
						onclick={() => (sizeGuideOpen = false)}
						aria-label="Close"
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-cream"
					>
						<Icon name="close" class="h-5 w-5" />
					</button>
				</div>
				<p class="mt-2 text-sm text-stone-600">{sizeGuide.note}</p>
				<table class="mt-4 w-full text-sm">
					<thead>
						<tr class="border-b border-line text-left">
							{#each sizeGuide.cols as col (col)}
								<th scope="col" class="px-3 py-2.5 font-bold text-ink first:pl-0">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each sizeGuide.rows as row, i (row[0])}
							<tr class={i % 2 === 0 ? 'bg-cream/60' : 'bg-white'}>
								{#each row as cell, j (j)}
									<td class="px-3 py-2.5 text-stone-600 first:pl-3 first:font-semibold first:text-ink">{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="mt-4 text-xs text-stone-400">
					Still unsure? Free 30-day returns — if the fit is wrong, send it back.
				</p>
			</div>
		</div>
	{/if}

	<!-- Image lightbox -->
	{#if lightbox}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="{product.name} — image {activeImg + 1} of {images.length}">
			<button
				type="button"
				aria-label="Close image viewer"
				onclick={() => (lightbox = false)}
				class="absolute inset-0 cursor-default bg-black/85"
			></button>
			<button
				type="button"
				bind:this={lightboxCloseBtn}
				onclick={() => (lightbox = false)}
				aria-label="Close"
				class="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow transition hover:scale-105"
			>
				<Icon name="close" class="h-5 w-5" />
			</button>
			{#if images.length > 1}
				<button
					type="button"
					onclick={() => stepImage(-1)}
					aria-label="Previous image"
					class="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow transition hover:scale-105 sm:left-6"
				>
					<Icon name="chevron-left" class="h-5 w-5" />
				</button>
				<button
					type="button"
					onclick={() => stepImage(1)}
					aria-label="Next image"
					class="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow transition hover:scale-105 sm:right-6"
				>
					<Icon name="chevron-right" class="h-5 w-5" />
				</button>
			{/if}
			<img
				src={images[activeImg] ?? product.src}
				alt={product.name}
				class="relative max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
			/>
			<span class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
				{activeImg + 1} / {images.length}
			</span>
		</div>
	{/if}
{/if}
