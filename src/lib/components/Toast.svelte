<script lang="ts">
	import { shop } from '../data/store.svelte';
</script>

{#if shop.toastMsg}
	<div
		role="status"
		class="animate-fade-up fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-xl"
	>
		{shop.toastMsg}
	</div>
{/if}
