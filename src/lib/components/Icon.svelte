<script lang="ts">
	let { name, class: cls = 'h-5 w-5' }: { name: string; class?: string } = $props();

	// Real SVG icons only — no emoji, no text glyphs.
	const paths: Record<string, string> = {
		bag: '<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
		search:
			'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>',
		heart:
			'<path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2Z"/>',
		cart: '<circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.2L20 8H6"/>',
		user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/>',
		menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
		close: '<path d="m6 6 12 12M18 6 6 18"/>',
		truck:
			'<path d="M1.5 6h12v10h-12z"/><path d="M13.5 10h4l3 3.5V16h-7"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
		shield:
			'<path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
		returns:
			'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
		headset:
			'<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19a4 4 0 0 1-4 2h-2"/>',
		star: '<path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3 1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z"/>',
		'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
		'chevron-left': '<path d="m14 6-6 6 6 6"/>',
		'chevron-right': '<path d="m10 6 6 6-6 6"/>',
		quote:
			'<path d="M10 8c-3 .5-5 2.5-5 6v2h5v-6H7.5C8 9 9 8.5 10 8.3V8Zm9 0c-3 .5-5 2.5-5 6v2h5v-6h-2.5c.5-1 1.5-1.5 2.5-1.7V8Z"/>',
		check: '<path d="m4.5 12.5 5 5 10-11"/>',
		plus: '<path d="M12 5v14M5 12h14"/>',
		minus: '<path d="M5 12h14"/>',
		mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
		phone: '<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
		pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
		tag: '<path d="m3 12 9-9h9v9l-9 9-9-9Z"/><circle cx="16.5" cy="7.5" r="1.4"/>',
		clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'
	};
</script>

<svg
	class={cls}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{@html paths[name] ?? ''}
</svg>
