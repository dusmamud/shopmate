<script lang="ts">
	import { reveal } from '../actions/reveal';
	import Icon from './Icon.svelte';
</script>

<section class="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8" aria-label="Why shop with us">
	<div
		use:reveal
		class="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white px-4 py-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] sm:px-6 lg:grid-cols-4"
	>
		{#each [
			{ icon: 'truck', title: 'Free Shipping', sub: 'On orders over $50' },
			{ icon: 'shield', title: 'Secure Payment', sub: '100% secure payment' },
			{ icon: 'returns', title: 'Easy Returns', sub: '30 days return policy' },
			{ icon: 'headset', title: '24/7 Support', sub: 'Dedicated support' }
		] as item}
			<div class="flex items-center gap-3">
				<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
					<Icon name={item.icon} class="h-5 w-5" />
				</span>
				<span>
					<span class="block text-sm font-bold text-ink">{item.title}</span>
					<span class="block text-xs text-stone-500">{item.sub}</span>
				</span>
			</div>
		{/each}
	</div>
</section>
