<script lang="ts">
	import Icon from './Icon.svelte';

	let { step }: { step: 1 | 2 | 3 } = $props();

	const steps = [
		{ n: 1, label: 'Cart', href: '/cart' },
		{ n: 2, label: 'Checkout', href: '/checkout' },
		{ n: 3, label: 'Confirmation', href: undefined }
	] as const;
</script>

<nav aria-label="Checkout progress" class="w-full">
	<ol class="flex items-center">
		{#each steps as s, i}
			<li class="flex items-center {i < steps.length - 1 ? 'flex-1' : ''}">
				{#if s.n < step && s.href}
					<a
						href={s.href}
						class="flex shrink-0 items-center gap-2 text-sm font-semibold text-olive transition hover:text-olive-dark"
					>
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-olive text-white">
							<Icon name="check" class="h-4 w-4" />
						</span>
						<span class="hidden sm:inline">{s.label}</span>
					</a>
				{:else if s.n === step}
					<span
						class="flex shrink-0 items-center gap-2 text-sm font-bold text-ink"
						aria-current="step"
					>
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-olive text-white">
							{s.n}
						</span>
						<span class="hidden sm:inline">{s.label}</span>
					</span>
				{:else}
					<span class="flex shrink-0 items-center gap-2 text-sm font-medium text-stone-500">
						<span class="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-stone-600">
							{s.n}
						</span>
						<span class="hidden sm:inline">{s.label}</span>
					</span>
				{/if}
				{#if i < steps.length - 1}
					<span
						class="mx-2 h-px flex-1 {s.n < step ? 'bg-olive' : 'bg-line'}"
						aria-hidden="true"
					></span>
				{/if}
			</li>
		{/each}
	</ol>
	<!-- Labels on very small screens (icons only above) -->
	<p class="mt-2 text-center text-xs font-semibold text-ink sm:hidden">
		Step {step} of 3: {steps[step - 1].label}
	</p>
</nav>
