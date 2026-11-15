<script lang="ts">
	import Icon from './Icon.svelte';

	let email = $state('');
	let subscribed = $state(false);

	function subscribe(e: Event) {
		e.preventDefault();
		if (!email.includes('@')) return;
		subscribed = true;
	}
</script>

<footer id="footer" class="border-t border-line bg-cream">
	<div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
		<div>
			<a href="#home" class="flex items-center gap-2">
				<span class="flex h-9 w-9 items-center justify-center rounded-xl bg-olive text-white">
					<Icon name="bag" class="h-5 w-5" />
				</span>
				<span class="text-xl font-extrabold tracking-tight">ShopMate</span>
			</a>
			<p class="mt-4 max-w-xs text-sm leading-relaxed text-stone-500">
				Your one-stop shop for quality products at the best prices.
			</p>
			<p class="mt-4 flex items-center gap-2 text-sm text-stone-500">
				<Icon name="mail" class="h-4 w-4 text-olive" /> hello@shopmate.store
			</p>
		</div>

		<nav aria-label="Quick links">
			<h3 class="text-sm font-bold tracking-wide text-ink">Quick Links</h3>
			<ul class="mt-4 space-y-2.5 text-sm text-stone-500">
				<li><a class="hover:text-olive" href="#home">Home</a></li>
				<li><a class="hover:text-olive" href="#products">Shop</a></li>
				<li><a class="hover:text-olive" href="#categories">Categories</a></li>
				<li><a class="hover:text-olive" href="#deals">Deals</a></li>
			</ul>
		</nav>

		<nav aria-label="Customer service">
			<h3 class="text-sm font-bold tracking-wide text-ink">Customer Service</h3>
			<ul class="mt-4 space-y-2.5 text-sm text-stone-500">
				<li><a class="hover:text-olive" href="#footer">Track Order</a></li>
				<li><a class="hover:text-olive" href="#footer">Returns &amp; Refunds</a></li>
				<li><a class="hover:text-olive" href="#footer">Shipping Policy</a></li>
				<li><a class="hover:text-olive" href="#footer">Help Center</a></li>
			</ul>
		</nav>

		<div>
			<h3 class="text-sm font-bold tracking-wide text-ink">Subscribe to our newsletter</h3>
			<p class="mt-4 text-sm leading-relaxed text-stone-500">
				Get the latest updates on new products and upcoming sales.
			</p>
			{#if subscribed}
				<p class="mt-4 flex items-center gap-2 rounded-xl bg-olive-soft px-4 py-3 text-sm font-medium text-olive-dark">
					<Icon name="check" class="h-4 w-4" /> Thanks — you're subscribed!
				</p>
			{:else}
				<form class="mt-4 flex overflow-hidden rounded-xl border border-line bg-white focus-within:border-olive" onsubmit={subscribe}>
					<label class="sr-only" for="newsletter-email">Email address</label>
					<input
						id="newsletter-email"
						type="email"
						required
						placeholder="Enter your email"
						bind:value={email}
						class="w-full min-w-0 px-3 py-2.5 text-sm outline-none placeholder:text-stone-400"
					/>
					<button type="submit" class="shrink-0 bg-olive px-4 text-sm font-semibold text-white transition hover:bg-olive-dark">
						Subscribe
					</button>
				</form>
			{/if}
		</div>
	</div>

	<div class="border-t border-line">
		<div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:px-6 lg:px-8">
			<p>© 2026 ShopMate. All rights reserved.</p>
			<p class="flex items-center gap-1.5">
				<Icon name="shield" class="h-4 w-4 text-olive" /> 100% secure payment · 30-day returns
			</p>
		</div>
	</div>
</footer>
