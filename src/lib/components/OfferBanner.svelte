<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
</script>

<section id="deals" class="mx-auto max-w-7xl scroll-mt-24 px-4 pt-12 sm:px-6 lg:px-8" use:reveal>
	<div class="grid overflow-hidden rounded-3xl bg-cream sm:grid-cols-2">
		<div class="flex flex-col items-start justify-center px-6 py-10 sm:px-10 sm:py-14">
			<p class="text-xs font-semibold tracking-wide text-stone-600">Special Offer</p>
			<h2 class="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Up to 50% Off</h2>
			<p class="mt-3 max-w-sm text-sm leading-relaxed text-stone-600">
				Limited time offer on selected items. Hurry up and grab the best deals!
			</p>
			<a
				href="/deals"
				class="mt-6 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
			>
				Shop the Sale <Icon name="arrow-right" class="h-4 w-4" />
			</a>
		</div>
		<div class="relative min-h-56 sm:min-h-72">
			<img
				src="/offer.webp"
				srcset="/offer-800.webp 800w, /offer-1200.webp 1200w, /offer-1600.webp 1600w, /offer.webp 2736w"
				sizes="(max-width: 640px) 100vw, 50vw"
				alt="Paper shopping bag with a 50% off tag and a small potted plant"
				loading="lazy"
				decoding="async"
				width="2736"
				height="912"
				class="absolute inset-0 h-full w-full object-cover object-right"
			/>
		</div>
	</div>
</section>
