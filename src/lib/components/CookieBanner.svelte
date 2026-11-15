<script lang="ts">
	import { onMount } from 'svelte';

	const CHOICE_KEY = 'shopmate_cookie_choice';

	let visible = $state(false);

	onMount(() => {
		try {
			if (!localStorage.getItem(CHOICE_KEY)) visible = true;
		} catch {
			// Storage unavailable — show the banner; the choice just won't persist.
			visible = true;
		}
	});

	function choose(value: 'accepted' | 'declined') {
		try {
			localStorage.setItem(CHOICE_KEY, value);
		} catch {
			// Storage unavailable — the banner still hides for this visit.
		}
		visible = false;
	}
</script>

{#if visible}
	<div
		class="animate-fade-up fixed inset-x-3 bottom-16 z-[60] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[26rem]"
		role="region"
		aria-label="Cookie notice"
	>
		<div
			class="rounded-2xl border border-line bg-white p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] sm:p-5"
		>
			<p class="text-[13px] leading-relaxed text-stone-600 sm:text-sm">
				We use <strong class="text-ink">localStorage on your device</strong> to remember your cart,
				wishlist and account. No tracking cookies, no analytics.
			</p>
			<div class="mt-3 flex gap-2">
				<button
					type="button"
					onclick={() => choose('accepted')}
					class="press flex-1 rounded-lg bg-olive px-4 py-2 text-sm font-semibold text-white transition hover:bg-olive-dark sm:py-2.5"
				>
					Accept
				</button>
				<button
					type="button"
					onclick={() => choose('declined')}
					class="press flex-1 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-olive sm:py-2.5"
				>
					Decline
				</button>
			</div>
			<p class="mt-2 text-xs text-stone-400">
				Read our
				<a href="/privacy-policy" class="font-medium text-olive underline underline-offset-2">
					Privacy Policy
				</a>
				for details.
			</p>
		</div>
	</div>
{/if}
