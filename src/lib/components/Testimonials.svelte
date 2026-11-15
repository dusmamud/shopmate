<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
	import Stars from './Stars.svelte';
	import { testimonials } from '../data/products';

	let index = $state(0);

	function prev() {
		index = (index - 1 + testimonials.length) % testimonials.length;
	}
	function next() {
		index = (index + 1) % testimonials.length;
	}
</script>

<section id="reviews" class="mx-auto max-w-7xl scroll-mt-24 px-4 pt-14 pb-16 sm:px-6 lg:px-8" use:reveal>
	<h2 class="text-center text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
		What Our Customers Say
	</h2>

	<!-- Mobile: one card at a time with arrows -->
	<div class="relative mt-8 lg:hidden">
		{#key index}
			<figure class="animate-fade-up rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
				<Icon name="quote" class="h-8 w-8 fill-olive text-olive opacity-25" />
				<blockquote class="mt-3 text-sm leading-relaxed text-stone-600">
					{testimonials[index].quote}
				</blockquote>
				<figcaption class="mt-5 flex items-center gap-3">
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
						style="background-color: {testimonials[index].color}"
					>
						{testimonials[index].initials}
					</span>
					<span>
						<span class="block text-sm font-semibold text-ink">{testimonials[index].name}</span>
						<Stars rating={5} />
					</span>
				</figcaption>
			</figure>
		{/key}
		<div class="mt-5 flex items-center justify-center gap-3">
			<button type="button" onclick={prev} aria-label="Previous review" class="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:bg-cream">
				<Icon name="chevron-left" class="h-5 w-5" />
			</button>
			<span class="text-xs font-medium text-stone-500">{index + 1} / {testimonials.length}</span>
			<button type="button" onclick={next} aria-label="Next review" class="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:bg-cream">
				<Icon name="chevron-right" class="h-5 w-5" />
			</button>
		</div>
	</div>

	<!-- Desktop: all three cards -->
	<div class="mt-8 hidden grid-cols-3 gap-5 lg:grid">
		{#each testimonials as t}
			<figure class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-lg">
				<Icon name="quote" class="h-8 w-8 fill-olive text-olive opacity-25" />
				<blockquote class="mt-3 text-sm leading-relaxed text-stone-600">{t.quote}</blockquote>
				<figcaption class="mt-5 flex items-center gap-3">
					<span
						class="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
						style="background-color: {t.color}"
					>
						{t.initials}
					</span>
					<span>
						<span class="block text-sm font-semibold text-ink">{t.name}</span>
						<Stars rating={5} />
					</span>
				</figcaption>
			</figure>
		{/each}
	</div>
</section>
