<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';
	import { products, type Product } from '../../lib/data/products';

	type BrandGroup = { name: string; count: number; photo: string; first: Product };

	const brands: BrandGroup[] = (() => {
		const map = new Map<string, Product[]>();
		for (const p of products) {
			const list = map.get(p.brand) ?? [];
			list.push(p);
			map.set(p.brand, list);
		}
		return [...map.entries()].map(([name, list]) => ({
			name,
			count: list.length,
			photo: list[0].src,
			first: list[0]
		}));
	})();
</script>

<svelte:head>
	<title>Shop by Brand — ShopMate</title>
	<meta
		name="description"
		content="Browse ShopMate products by brand — Nova, Aural, Trekker, Stride, Elan, ThreadCo and Lumina."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/brands" />
	<meta property="og:title" content="Shop by Brand — ShopMate" />
	<meta
		property="og:description"
		content="Browse ShopMate products by brand — Nova, Aural, Trekker, Stride, Elan, ThreadCo and Lumina."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/brands" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Shop by Brand — ShopMate" />
	<meta
		name="twitter:description"
		content="Browse ShopMate products by brand — Nova, Aural, Trekker, Stride, Elan, ThreadCo and Lumina."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Brands' }]} />
	<div class="mt-4" use:reveal>
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Shop by Brand</h1>
		<p class="mt-1 max-w-2xl text-sm text-stone-500 sm:text-base">
			Every brand we carry, from everyday essentials to premium picks. Tap a brand to see its
			products.
		</p>
	</div>

	<div class="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
		{#each brands as brand, i (brand.name)}
			<a
				href="/shop?brand={encodeURIComponent(brand.name)}"
				style="--i: {i}"
				class="card-in group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="relative aspect-[4/3] overflow-hidden bg-[#f6f1e7]">
					<img
						src={brand.photo}
						srcset={brand.photo.includes('backpack') || brand.photo.includes('headphones')
							? `${brand.photo.replace('.webp', '-400.webp')} 400w, ${brand.photo.replace('.webp', '-800.webp')} 800w, ${brand.photo.replace('.webp', '-1200.webp')} 1200w, ${brand.photo} 1600w`
							: `${brand.photo.replace('.webp', '-400.webp')} 400w, ${brand.photo.replace('.webp', '-800.webp')} 800w, ${brand.photo} ${brand.photo.includes('lamp') || brand.photo.includes('tshirt') ? 1120 : 912}w`}
						sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 300px"
						alt="{brand.name} — {brand.first.name}"
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
					<span
						class="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-ink shadow"
					>
						{brand.count} {brand.count === 1 ? 'product' : 'products'}
					</span>
				</div>
				<div class="flex flex-1 items-center justify-between gap-3 p-4">
					<div class="min-w-0">
						<h2 class="truncate text-base font-bold text-ink group-hover:text-olive">
							{brand.name}
						</h2>
						<p class="mt-0.5 truncate text-xs text-stone-500">From {brand.first.name}</p>
					</div>
					<span
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive transition group-hover:bg-olive group-hover:text-white"
					>
						<Icon name="arrow-right" class="h-4 w-4" />
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
