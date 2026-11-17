<script lang="ts">
	import Icon from './Icon.svelte';

	let email = $state('');
	let subscribed = $state(false);
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	function subscribe(e: Event) {
		e.preventDefault();
		if (!email.includes('@')) return;
		subscribed = true;
	}

	async function copyCode() {
		try {
			await navigator.clipboard.writeText('WELCOME10');
		} catch {
			// Clipboard unavailable — the code is shown as text, so the
			// subscriber can still copy it by hand.
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

<footer id="footer" class="border-t border-line bg-cream">
	<div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
		<div>
			<a href="/" class="flex items-center gap-2">
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
				<li><a class="hover:text-olive" href="/">Home</a></li>
				<li><a class="hover:text-olive" href="/shop">Shop</a></li>
				<li><a class="hover:text-olive" href="/categories">Categories</a></li>
				<li><a class="hover:text-olive" href="/deals">Deals</a></li>
				<li><a class="hover:text-olive" href="/new-arrivals">New Arrivals</a></li>
				<li><a class="hover:text-olive" href="/best-sellers">Best Sellers</a></li>
				<li><a class="hover:text-olive" href="/brands">Brands</a></li>
				<li><a class="hover:text-olive" href="/gift-cards">Gift Cards</a></li>
				<li><a class="hover:text-olive" href="/about">About Us</a></li>
				<li><a class="hover:text-olive" href="/blog">Blog</a></li>
				<li><a class="hover:text-olive" href="/track-order">Track Order</a></li>
			</ul>
		</nav>

		<nav aria-label="Customer service">
			<h3 class="text-sm font-bold tracking-wide text-ink">Customer Service</h3>
			<ul class="mt-4 space-y-2.5 text-sm text-stone-500">
				<li><a class="hover:text-olive" href="/track-order">Track Order</a></li>
				<li><a class="hover:text-olive" href="/returns-policy">Returns &amp; Refunds</a></li>
				<li><a class="hover:text-olive" href="/shipping-policy">Shipping Policy</a></li>
				<li><a class="hover:text-olive" href="/privacy-policy">Privacy Policy</a></li>
				<li><a class="hover:text-olive" href="/terms">Terms of Service</a></li>
				<li><a class="hover:text-olive" href="/cookie-policy">Cookie Policy</a></li>
				<li><a class="hover:text-olive" href="/accessibility">Accessibility</a></li>
				<li><a class="hover:text-olive" href="/careers">Careers</a></li>
				<li><a class="hover:text-olive" href="/sitemap">Sitemap</a></li>
				<li><a class="hover:text-olive" href="/help">Help Center</a></li>
			</ul>
		</nav>

		<div>
			<h3 class="text-sm font-bold tracking-wide text-ink">Subscribe to our newsletter</h3>
			<p class="mt-4 text-sm leading-relaxed text-stone-500">
				Get the latest updates on new products and upcoming sales.
			</p>
			{#if subscribed}
				<div class="mt-4 rounded-xl bg-olive-soft px-4 py-3">
					<p class="flex items-center gap-2 text-sm font-medium text-olive-dark">
						<Icon name="check" class="h-4 w-4 shrink-0" /> Thanks — you're subscribed!
					</p>
					<p class="mt-2 text-sm text-stone-600">
						Your welcome code:
						<span class="font-mono font-extrabold tracking-wider text-olive">WELCOME10</span>
						— 10% off your first order
					</p>
					<button
						type="button"
						onclick={copyCode}
						class="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-olive px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-olive-dark"
					>
						{#if copied}
							<Icon name="check" class="h-3.5 w-3.5" /> Copied
						{:else}
							Copy code
						{/if}
					</button>
				</div>
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
