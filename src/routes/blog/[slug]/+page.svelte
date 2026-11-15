<script lang="ts">
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { getPost, relatedPosts } from '../../../lib/data/blog';

	const post = $derived(getPost(page.params.slug ?? ''));
	const related = $derived(post ? relatedPosts(post.slug) : []);
</script>

<svelte:head>
	<title>{post ? `${post.title} — ShopMate Blog` : 'Post not found — ShopMate Blog'}</title>
	{#if post}
		<meta name="description" content={post.excerpt} />
		<meta property="og:title" content="{post.title} — ShopMate Blog" />
		<meta property="og:description" content={post.excerpt} />
		<meta property="og:type" content="article" />
		<meta property="og:image" content="https://shopmates.pages.dev/hero.webp" />
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
			{#each post.body as para (para.slice(0, 48))}
				<p class="text-base leading-relaxed text-stone-700">{para}</p>
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
							<p class="text-xs font-medium text-stone-400">{rel.date} · {rel.minutes} min read</p>
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
