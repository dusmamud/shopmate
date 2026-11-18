<script lang="ts">
	import Icon from './Icon.svelte';
	import { heroCustomers } from '../data/products';
</script>

<section id="home" class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
	<div class="grid overflow-hidden rounded-3xl bg-cream lg:grid-cols-2">
		<div class="animate-fade-up px-5 py-8 sm:px-10 lg:py-16">
			<p class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-olive uppercase shadow-sm">
				<span class="h-1.5 w-1.5 rounded-full bg-olive"></span> New Arrivals
			</p>
			<h1 class="mt-4 text-[clamp(1.8rem,7.5vw,3.4rem)] leading-[1.08] font-bold tracking-tight text-ink">
				Discover The Best Products for You
			</h1>
			<p class="mt-3 max-w-md text-sm leading-relaxed text-stone-600 sm:mt-4 sm:text-base">
				Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!
			</p>
			<div class="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
				<a
					href="/shop"
					class="press inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-olive-dark"
				>
					Shop Now <Icon name="arrow-right" class="h-4 w-4" />
				</a>
				<a
					href="/deals"
					class="press inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
				>
					Explore Deals
				</a>
			</div>
			<div class="mt-7 flex items-center gap-3 sm:mt-8">
				<div class="flex -space-x-2">
					{#each heroCustomers as photo, i}
						<img
							src={photo}
							alt="Happy ShopMate customer {i + 1}"
							loading="lazy"
							decoding="async"
							width="112"
							height="112"
							class="h-8 w-8 rounded-full border-2 border-cream object-cover"
						/>
					{/each}
				</div>
				<p class="text-xs leading-snug font-medium text-stone-600 sm:text-sm">
					Trusted by <span class="font-bold text-ink">10,000+</span> Happy Customers
				</p>
			</div>
		</div>

		<div class="relative h-64 overflow-hidden sm:h-80 lg:h-auto lg:min-h-105">
			<img
				src="/hero.webp"
				srcset="/hero-400.webp 400w, /hero-800.webp 800w, /hero-1200.webp 1200w, /hero.webp 1920w"
				sizes="(max-width: 1023px) 100vw, 50vw"
				alt="Olive travel backpack with cream wireless headphones and a small potted plant"
				fetchpriority="high"
				loading="eager"
				decoding="async"
				width="1920"
				height="1280"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	</div>
</section>
