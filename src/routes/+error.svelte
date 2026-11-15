<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page not found — ShopMate</title>
</svelte:head>

<main class="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
	<p class="text-6xl font-extrabold text-olive">{page.status}</p>
	<h1 class="mt-4 text-2xl font-extrabold text-ink">This page is out of stock</h1>
	<p class="mt-2 max-w-sm text-sm text-stone-500">
		{page.error?.message ?? 'The page you are looking for does not exist.'}
	</p>
	<a
		href="/"
		class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
	>
		Back to Shop
	</a>
</main>
