<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import { blogPosts } from '../../lib/data/blog';
</script>

<svelte:head>
	<title>Blog — Shopping Guides &amp; Tips — ShopMate</title>
	<meta
		name="description"
		content="Practical shopping guides from ShopMate: how to choose running shoes, what to check before buying wireless headphones, and building a capsule wardrobe."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/blog" />
	<meta property="og:title" content="Blog — Shopping Guides &amp; Tips — ShopMate" />
	<meta
		property="og:description"
		content="Practical shopping guides from ShopMate: how to choose running shoes, what to check before buying wireless headphones, and building a capsule wardrobe."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/blog" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Blog — Shopping Guides &amp; Tips — ShopMate" />
	<meta
		name="twitter:description"
		content="Practical shopping guides from ShopMate: how to choose running shoes, what to check before buying wireless headphones, and building a capsule wardrobe."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<nav aria-label="Breadcrumb" class="text-xs text-stone-500">
		<a href="/" class="hover:text-olive">Home</a>
		<span class="mx-1.5">/</span>
		<span class="font-medium text-ink">Blog</span>
	</nav>

	<h1 class="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Shopping Guides &amp; Tips</h1>
	<p class="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
		Short, practical guides to help you buy better — no jargon, no sponsored picks, just what
		we have learned from the products we sell.
	</p>

	<div class="mt-8 grid gap-5 md:grid-cols-3">
		{#each blogPosts as post (post.slug)}
			<article
				class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="flex flex-1 flex-col p-5 sm:p-6">
					<p class="flex items-center gap-2 text-xs font-medium text-stone-500">
						<Icon name="clock" class="h-3.5 w-3.5" />
						{post.date} · {post.minutes} min read
					</p>
					<h2 class="mt-3 text-lg leading-snug font-bold text-ink">
						<a href="/blog/{post.slug}" class="transition group-hover:text-olive">{post.title}</a>
					</h2>
					<p class="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
					<a
						href="/blog/{post.slug}"
						class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-olive transition hover:text-olive-dark"
					>
						Read the guide <Icon name="arrow-right" class="h-4 w-4" />
					</a>
				</div>
			</article>
		{/each}
	</div>
</section>
