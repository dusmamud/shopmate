<script lang="ts">
	import Icon from './Icon.svelte';
	import { shop } from '../data/store.svelte';
</script>

<!-- Floating compare tray button — mount in +layout when ready. -->
{#if shop.compare.length > 0}
	<a
		href="/compare"
		aria-label="Compare {shop.compare.length} products"
		class="press fixed bottom-20 left-4 z-40 flex min-h-11 items-center gap-2 rounded-full bg-olive px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-olive-dark"
	>
		<Icon name="sliders" class="h-4 w-4" />
		Compare ({shop.compare.length})
	</a>
{/if}
