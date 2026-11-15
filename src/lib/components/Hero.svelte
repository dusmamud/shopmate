<script lang="ts">
	import Icon from './Icon.svelte';
	import { heroCustomers } from '../data/products';
</script>

<section id="home" class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
	<div class="grid overflow-hidden rounded-3xl bg-cream lg:grid-cols-2">
		<div class="animate-fade-up px-6 py-10 sm:px-10 lg:py-16">
			<p class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-widest text-olive uppercase shadow-sm">
				<span class="h-1.5 w-1.5 rounded-full bg-olive"></span> New Arrivals
			</p>
			<h1 class="mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
				Discover The Best Products for You
			</h1>
			<p class="mt-4 max-w-md text-sm leading-relaxed text-stone-500 sm:text-base">
				Explore our wide range of high-quality products at affordable prices. Shop now and enjoy the best deals!
			</p>
			<div class="mt-7 flex flex-wrap items-center gap-3">
				<a
					href="/shop"
					class="inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-olive-dark"
				>
					Shop Now <Icon name="arrow-right" class="h-4 w-4" />
				</a>
				<a
					href="/deals"
					class="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
				>
					Explore Deals
				</a>
			</div>
			<div class="mt-8 flex items-center gap-3">
				<div class="flex -space-x-2.5">
					{#each heroCustomers as photo, i}
						<img
							src={photo}
							alt="Happy ShopMate customer {i + 1}"
							loading="lazy"
							class="h-9 w-9 rounded-full border-2 border-cream object-cover"
						/>
					{/each}
				</div>
				<p class="text-xs font-medium text-stone-500 sm:text-sm">
					Trusted by <span class="font-bold text-ink">10,000+</span> Happy Customers
				</p>
			</div>
		</div>

		<div class="relative flex items-center justify-center overflow-hidden px-6 py-10 lg:py-8">
			<!-- soft glow behind the product -->
			<div class="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl sm:h-96 sm:w-96"></div>
			<!-- soft ground shadow -->
			<div class="absolute bottom-8 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-stone-900/15 blur-xl sm:bottom-12"></div>
			<img
				src="/hero-cutout.png"
				alt="Olive travel backpack with cream wireless headphones and a small potted plant"
				fetchpriority="high"
				class="animate-float relative w-full max-w-105 drop-shadow-2xl sm:max-w-125"
			/>
		</div>
	</div>
</section>
