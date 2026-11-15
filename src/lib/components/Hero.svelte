<script lang="ts">
	import Icon from './Icon.svelte';

	const customers = [
		{ initials: 'AR', color: '#5c7038' },
		{ initials: 'PK', color: '#c9a86a' },
		{ initials: 'NS', color: '#7d9b52' },
		{ initials: 'RV', color: '#8a6d4b' }
	];
</script>

<section id="home" class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
	<div class="grid items-center gap-8 overflow-hidden rounded-3xl bg-cream px-6 py-10 sm:px-10 lg:grid-cols-2 lg:gap-4 lg:py-0">
		<div class="animate-fade-up py-2 lg:py-16">
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
					href="#products"
					class="inline-flex items-center gap-2 rounded-lg bg-olive px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-olive-dark"
				>
					Shop Now <Icon name="arrow-right" class="h-4 w-4" />
				</a>
				<a
					href="#deals"
					class="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-olive hover:text-olive"
				>
					Explore Deals
				</a>
			</div>
			<div class="mt-8 flex items-center gap-3">
				<div class="flex -space-x-2.5">
					{#each customers as c}
						<span
							class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream text-[10px] font-bold text-white"
							style="background-color: {c.color}"
							aria-hidden="true"
						>
							{c.initials}
						</span>
					{/each}
				</div>
				<p class="text-xs font-medium text-stone-500 sm:text-sm">
					Trusted by <span class="font-bold text-ink">10,000+</span> Happy Customers
				</p>
			</div>
		</div>

		<div class="animate-fade-up relative lg:py-8">
			<img
				src="/hero.webp"
				alt="Olive travel backpack with cream wireless headphones and a small potted plant on a pedestal"
				fetchpriority="high"
				class="animate-float w-full rounded-2xl object-cover shadow-lg"
			/>
		</div>
	</div>
</section>
