<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
	import Stars from './Stars.svelte';
	import { testimonials } from '../data/products';

	// Rotating order: the side arrows (desktop, like the reference) rotate
	// which review leads; on mobile one card shows at a time.
	let offset = $state(0);
	const shown = $derived(
		testimonials.map((_, i) => testimonials[(i + offset) % testimonials.length])
	);
	const current = $derived(testimonials[offset % testimonials.length]);

	function prev() {
		offset = (offset - 1 + testimonials.length) % testimonials.length;
	}
	function next() {
		offset = (offset + 1) % testimonials.length;
	}
</script>

<section id="reviews" class="mx-auto max-w-7xl scroll-mt-24 px-4 pt-14 pb-16 sm:px-6 lg:px-8" use:reveal>
	<h2 class="text-center text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
		What Our Customers Say
	</h2>

	<!-- Mobile: one card at a time with arrows -->
	<div class="relative mt-8 lg:hidden">
		{#key offset}
			<figure class="animate-fade-up rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				<Icon name="quote" class="h-8 w-8 fill-olive text-olive" />
				<blockquote class="mt-3 text-sm leading-relaxed text-stone-600">
					{current.quote}
				</blockquote>
				<figcaption class="mt-5 flex items-center gap-3">
					<img src={current.photo} alt={current.name} loading="lazy" class="h-10 w-10 rounded-full object-cover" />
					<span>
						<span class="block text-sm font-semibold text-ink">{current.name}</span>
						<Stars rating={5} />
					</span>
				</figcaption>
			</figure>
		{/key}
		<div class="mt-5 flex items-center justify-center gap-3">
			<button type="button" onclick={prev} aria-label="Previous review" class="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:bg-cream">
				<Icon name="chevron-left" class="h-5 w-5" />
			</button>
			<span class="text-xs font-medium text-stone-500">{offset + 1} / {testimonials.length}</span>
			<button type="button" onclick={next} aria-label="Next review" class="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:bg-cream">
				<Icon name="chevron-right" class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- Desktop: all three cards with side arrows, like the reference -->
	<div class="relative mt-8 hidden lg:block">
		<div class="grid grid-cols-3 gap-5 px-14">
			{#each shown as t (t.name)}
				<figure class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
					<Icon name="quote" class="h-8 w-8 fill-olive text-olive" />
					<blockquote class="mt-3 text-sm leading-relaxed text-stone-600">{t.quote}</blockquote>
					<figcaption class="mt-5 flex items-center gap-3">
						<img src={t.photo} alt={t.name} loading="lazy" class="h-10 w-10 rounded-full object-cover" />
						<span>
							<span class="block text-sm font-semibold text-ink">{t.name}</span>
							<Stars rating={5} />
						</span>
					</figcaption>
				</figure>
			{/each}
		</div>
		<button
			type="button"
			onclick={prev}
			aria-label="Previous reviews"
			class="absolute top-1/2 left-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition hover:bg-cream"
		>
			<Icon name="chevron-left" class="h-5 w-5" />
		</button>
		<button
			type="button"
			onclick={next}
			aria-label="Next reviews"
			class="absolute top-1/2 right-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition hover:bg-cream"
		>
			<Icon name="chevron-right" class="h-5 w-5" />
		</button>
	</div>
</section>
