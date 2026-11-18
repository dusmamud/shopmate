<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { getPost, relatedPosts } from '../../../lib/data/blog';

	const post = $derived(getPost(page.params.slug ?? ''));
	const related = $derived(post ? relatedPosts(post.slug) : []);

	/** ISO publication dates (from blog.ts display dates: Nov 10 / Nov 5 / Oct 28, 2026). */
	const datePublishedBySlug: Record<string, string> = {
		'choose-right-running-shoes': '2026-11-10',
		'wireless-headphones-buying-guide': '2026-11-05',
		'capsule-wardrobe-beginners-guide': '2026-10-28'
	};

	/** Short display titles used in <title>/og:title/twitter:title (post.title stays the headline). */
	const displayTitleBySlug: Record<string, string> = {
		'wireless-headphones-buying-guide': 'Wireless Headphones Buying Guide',
		'capsule-wardrobe-beginners-guide': 'Capsule Wardrobe Guide for Beginners'
	};

	/** One relevant existing product image per post, with the real price from products.ts. */
	const figureBySlug: Record<string, { src: string; alt: string; caption: string }> = {
		'choose-right-running-shoes': {
			src: '/product-shoes-800.webp',
			alt: 'Running Shoes',
			caption: 'Running Shoes — $49.99 at ShopMate'
		},
		'wireless-headphones-buying-guide': {
			src: '/product-headphones-800.webp',
			alt: 'Wireless Headphones',
			caption: 'Wireless Headphones — $59.99 at ShopMate'
		},
		'capsule-wardrobe-beginners-guide': {
			src: '/product-tshirt-800.webp',
			alt: 'Classic Cotton T-Shirt',
			caption: 'Classic Cotton T-Shirt — $19.99 at ShopMate'
		}
	};

	const displayTitle = $derived(
		post ? (displayTitleBySlug[post.slug] ?? post.title) : ''
	);
	const datePublished = $derived(post ? (datePublishedBySlug[post.slug] ?? '') : '');
	const figure = $derived(post ? figureBySlug[post.slug] : undefined);
	const postUrl = $derived(post ? 'https://shopmates.pages.dev/blog/' + post.slug : '');

	const blogJsonLd = $derived(
		post && figure
			? JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BlogPosting',
					headline: post.title,
					datePublished,
					author: {
						'@type': 'Organization',
						'@id': 'https://shopmates.pages.dev/#organization',
						name: 'ShopMate'
					},
					image: 'https://shopmates.pages.dev' + figure.src,
					mainEntityOfPage: postUrl,
					description: post.excerpt
				})
			: ''
	);
</script>

<svelte:head>
	<title>{post ? `${displayTitle} — ShopMate Blog` : 'Post not found — ShopMate Blog'}</title>
	{#if post && figure}
		<link rel="canonical" href={postUrl} />
		<meta name="description" content={post.excerpt} />
		<meta property="og:title" content="{displayTitle} — ShopMate Blog" />
		<meta property="og:description" content={post.excerpt} />
		<meta property="og:type" content="article" />
		<meta property="og:url" content={postUrl} />
		<meta property="og:image" content={'https://shopmates.pages.dev' + figure.src} />
		<meta property="article:published_time" content={datePublished} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="{displayTitle} — ShopMate Blog" />
		<meta name="twitter:description" content={post.excerpt} />
		<meta name="twitter:image" content={'https://shopmates.pages.dev' + figure.src} />
		{@html `<script type="application/ld+json">${blogJsonLd}</script>`}
	{/if}
</svelte:head>

{#if !post}
	<div class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
		<Icon name="alert" class="mx-auto h-12 w-12 text-stone-300" />
		<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink">Post not found</h1>
		<p class="mt-2 text-sm text-stone-500">This guide does not exist or was removed.</p>
		<a
			href="/blog"
			class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
		>
			Back to Blog <Icon name="arrow-right" class="h-4 w-4" />
		</a>
	</div>
{:else}
	<article class="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
		<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
			<a href="/" class="hover:text-olive">Home</a>
			<span class="mx-1.5">/</span>
			<a href="/blog" class="hover:text-olive">Blog</a>
			<span class="mx-1.5">/</span>
			<span class="font-medium text-ink">{post.title}</span>
		</nav>

		<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{post.title}</h1>
		<p class="mt-3 flex flex-wrap items-center gap-2 text-sm text-stone-500">
			<Icon name="clock" class="h-4 w-4 text-olive" />
			<span>{post.date}</span>
			<span aria-hidden="true">·</span>
			<span>{post.minutes} min read</span>
		</p>

		<div class="mt-8 space-y-5">
			{#each post.body as para, i (para.slice(0, 48))}
				<p class="text-base leading-relaxed text-stone-700">{para}</p>
				{#if i === 0 && figure}
					<figure>
						<img
							src={figure.src}
							srcset="{figure.src.replace('-800.webp', '-400.webp')} 400w, {figure.src} 800w"
							sizes="(max-width: 768px) 100vw, 768px"
							width="800"
							height="800"
							loading="lazy"
							alt={figure.alt}
							class="w-full rounded-2xl object-cover"
						/>
						<figcaption class="mt-2 text-sm text-stone-500">{figure.caption}</figcaption>
					</figure>
				{/if}
			{/each}
		</div>

		<div class="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
			<a
				href="/blog"
				class="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
			>
				<Icon name="chevron-left" class="h-4 w-4" /> Back to Blog
			</a>
			<a
				href="/shop"
				class="inline-flex items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Shop the Collection <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>

		{#if related.length > 0}
			<section class="mt-12">
				<h2 class="text-xl font-extrabold tracking-tight text-ink">Keep reading</h2>
				<div class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each related as rel (rel.slug)}
						<a
							href="/blog/{rel.slug}"
							class="group rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg"
						>
							<p class="text-xs font-medium text-stone-500">{rel.date} · {rel.minutes} min read</p>
							<h3 class="mt-2 text-base leading-snug font-bold text-ink group-hover:text-olive">
								{rel.title}
							</h3>
							<p class="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">{rel.excerpt}</p>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	</article>
{/if}
