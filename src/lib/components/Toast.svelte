<script lang="ts">
	import { shop } from '../data/store.svelte';
</script>

{#if shop.toastMsg}
	<div
		role="status"
		class="animate-toast-in fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium whitespace-nowrap text-white shadow-xl lg:bottom-5"
	>
		{shop.toastMsg}
	</div>
{/if}
