<script lang="ts">
	// Hand-drawn flat SVG product illustrations, generated for this site.
	// Used for categories and for products without an AI photo, so every
	// visual on the page is made for ShopMate — no stock images.
	let { kind, class: cls = 'h-full w-full' }: { kind: string; class?: string } = $props();
</script>

{#if kind === 'headphones'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<path d="M30 78a30 30 0 0 1 60 0" stroke="#4a5c2c" stroke-width="7" stroke-linecap="round" />
		<rect x="20" y="72" width="18" height="30" rx="9" fill="#5c7038" />
		<rect x="82" y="72" width="18" height="30" rx="9" fill="#5c7038" />
		<rect x="26" y="79" width="6" height="16" rx="3" fill="#eef2e2" />
		<rect x="88" y="79" width="6" height="16" rx="3" fill="#eef2e2" />
	</svg>
{:else if kind === 'shirt'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<path d="M38 28 20 38l8 16 10-4v52a4 4 0 0 0 4 4h36a4 4 0 0 0 4-4V50l10 4 8-16-18-10a12 12 0 0 1-24 0Z" fill="#7d9b52" />
		<path d="M48 28a12 12 0 0 0 24 0" stroke="#5c7038" stroke-width="3" />
		<path d="M42 102V50M78 102V50" stroke="#5c7038" stroke-width="2" opacity=".35" />
	</svg>
{:else if kind === 'sofa'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<rect x="18" y="52" width="84" height="26" rx="8" fill="#c9a86a" />
		<rect x="14" y="42" width="20" height="30" rx="8" fill="#d9bc82" />
		<rect x="86" y="42" width="20" height="30" rx="8" fill="#d9bc82" />
		<rect x="24" y="72" width="72" height="14" rx="6" fill="#b8934f" />
		<rect x="26" y="86" width="8" height="10" rx="2" fill="#5c7038" />
		<rect x="86" y="86" width="8" height="10" rx="2" fill="#5c7038" />
		<rect x="30" y="58" width="24" height="14" rx="4" fill="#e8d5a8" />
		<rect x="66" y="58" width="24" height="14" rx="4" fill="#8fae5f" />
	</svg>
{:else if kind === 'perfume'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<rect x="52" y="18" width="16" height="12" rx="2" fill="#3a3a2e" />
		<rect x="56" y="30" width="8" height="8" fill="#c9a86a" />
		<path d="M42 38h36l6 12v44a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V50l6-12Z" fill="#f2ddc4" stroke="#d9bc82" stroke-width="2" />
		<path d="M42 50h36v44a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8V50Z" fill="#eecfa8" />
		<rect x="48" y="62" width="24" height="16" rx="2" fill="#fffdf6" />
		<path d="M52 66h16" stroke="#5c7038" stroke-width="2" />
	</svg>
{:else if kind === 'sneaker'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<path d="M18 78c0-4 2-6 6-6 8 0 14-2 20-8l6-6c2-2 5-2 7 0l4 4c6 6 14 10 24 10 6 0 10 2 12 6 1 3-1 6-5 6H24c-4 0-6-2-6-6Z" fill="#f5f2ea" stroke="#d8d2c2" stroke-width="2" />
		<path d="M18 78h90" stroke="#5c7038" stroke-width="4" />
		<path d="M52 62l6 4M60 58l6 4M68 55l6 4" stroke="#9aa08a" stroke-width="2.5" stroke-linecap="round" />
		<circle cx="30" cy="70" r="3" fill="#5c7038" />
	</svg>
{:else if kind === 'watch'}
	<svg class={cls} viewBox="0 0 120 120" fill="none" aria-hidden="true">
		<rect x="48" y="14" width="24" height="22" rx="4" fill="#2e2e26" />
		<rect x="48" y="84" width="24" height="22" rx="4" fill="#2e2e26" />
		<circle cx="60" cy="60" r="28" fill="#f5f2ea" stroke="#2e2e26" stroke-width="4" />
		<circle cx="60" cy="60" r="20" fill="#fffdf6" />
		<path d="M60 60 60 44M60 60l10 6" stroke="#1a1d16" stroke-width="3" stroke-linecap="round" />
		<circle cx="60" cy="60" r="2.5" fill="#5c7038" />
		<path d="M60 42v3M60 75v3M42 60h3M75 60h3" stroke="#9aa08a" stroke-width="2" />
	</svg>
{:else if kind === 'smartwatch'}
	<svg class={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
		<rect x="72" y="8" width="56" height="34" rx="10" fill="#1f1f1a" />
		<rect x="72" y="158" width="56" height="34" rx="10" fill="#1f1f1a" />
		<rect x="58" y="36" width="84" height="128" rx="26" fill="#1f1f1a" />
		<rect x="66" y="44" width="68" height="112" rx="20" fill="#2b2b26" />
		<path d="M100 66v22l16 10" stroke="#a8cf5a" stroke-width="5" stroke-linecap="round" />
		<circle cx="100" cy="88" r="4" fill="#a8cf5a" />
		<path d="M84 132h32" stroke="#5c6b7a" stroke-width="4" stroke-linecap="round" />
		<circle cx="84" cy="56" r="3" fill="#e5484d" />
	</svg>
{:else if kind === 'shoes'}
	<svg class={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
		<path d="M28 128c0-8 4-12 12-12 14 0 26-4 38-16l10-10c4-4 10-4 14 0l8 8c12 12 26 18 44 18 10 0 18 4 20 12 2 6-2 12-10 12H40c-8 0-12-4-12-12Z" fill="#f5f2ea" stroke="#d8d2c2" stroke-width="3" />
		<path d="M28 128h144" stroke="#5c7038" stroke-width="7" />
		<path d="M96 104l10 7M112 96l10 7M128 90l10 7" stroke="#9aa08a" stroke-width="4" stroke-linecap="round" />
		<circle cx="52" cy="116" r="5" fill="#5c7038" />
	</svg>
{:else if kind === 'bottle'}
	<svg class={cls} viewBox="0 0 200 200" fill="none" aria-hidden="true">
		<rect x="86" y="26" width="28" height="20" rx="3" fill="#3a3a2e" />
		<rect x="92" y="46" width="16" height="14" fill="#c9a86a" />
		<path d="M70 60h60l10 20v74a14 14 0 0 1-14 14H74a14 14 0 0 1-14-14V80l10-20Z" fill="#f2ddc4" stroke="#d9bc82" stroke-width="3" />
		<path d="M70 82h60v72a14 14 0 0 1-14 14H84a14 14 0 0 1-14-14V82Z" fill="#eecfa8" />
		<rect x="80" y="104" width="40" height="28" rx="3" fill="#fffdf6" />
		<path d="M88 112h24M88 120h16" stroke="#5c7038" stroke-width="3" stroke-linecap="round" />
	</svg>
{/if}
