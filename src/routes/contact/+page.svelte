<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';

	let name = $state('');
	let email = $state('');
	let subject = $state('Order question');
	let message = $state('');
	let errors = $state<{ name?: string; email?: string; message?: string }>({});
	let sent = $state(false);

	const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = {};
		if (!name.trim()) errors.name = 'Please enter your name.';
		if (!emailOk(email)) errors.email = 'Enter a valid email address.';
		if (message.trim().length < 10) errors.message = 'Please write at least 10 characters so we can help.';
		if (Object.keys(errors).length > 0) return;
		sent = true;
	}

	function sendAnother() {
		sent = false;
		name = '';
		email = '';
		subject = 'Order question';
		message = '';
		errors = {};
	}

	const info = [
		{ icon: 'mail', label: 'Email us', value: 'hello@shopmate.store', href: 'mailto:hello@shopmate.store' },
		{ icon: 'phone', label: 'Call us', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
		{ icon: 'pin', label: 'Visit us', value: '123 Market Street, Austin, TX 78701', href: undefined },
		{ icon: 'clock', label: 'Opening hours', value: 'Mon–Sat, 9am–6pm', href: undefined }
	] as const;
</script>

<svelte:head>
	<title>Contact Us — ShopMate</title>
	<meta
		name="description"
		content="Contact ShopMate — email hello@shopmate.store, call +1 (555) 123-4567, or visit 123 Market Street, Austin. We usually reply within one business day."
	/>
	<link rel="canonical" href="https://shopmates.pages.dev/contact" />
	<meta property="og:title" content="Contact Us — ShopMate" />
	<meta
		property="og:description"
		content="Contact ShopMate — email hello@shopmate.store, call +1 (555) 123-4567, or visit 123 Market Street, Austin. We usually reply within one business day."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://shopmates.pages.dev/contact" />
	<meta property="og:image" content="https://shopmates.pages.dev/og-image.webp" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Contact Us — ShopMate" />
	<meta
		name="twitter:description"
		content="Contact ShopMate — email hello@shopmate.store, call +1 (555) 123-4567, or visit 123 Market Street, Austin. We usually reply within one business day."
	/>
	<meta name="twitter:image" content="https://shopmates.pages.dev/og-image.webp" />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Contact Us</h1>
	<p class="mt-1 text-sm text-stone-500">Questions about an order, a return or a product? We're here to help.</p>

	<div class="mt-8 grid gap-6 lg:grid-cols-5">
		<!-- Contact info -->
		<div class="space-y-4 lg:col-span-2">
			{#each info as item (item.label)}
				<div class="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
					<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
						<Icon name={item.icon} class="h-5 w-5" />
					</span>
					<div class="min-w-0">
						<p class="text-sm font-semibold text-ink">{item.label}</p>
						{#if item.href}
							<a href={item.href} class="mt-0.5 block text-sm break-words text-olive hover:text-olive-dark">{item.value}</a>
						{:else}
							<p class="mt-0.5 text-sm break-words text-stone-500">{item.value}</p>
						{/if}
					</div>
				</div>
			{/each}
			<p class="rounded-2xl bg-cream px-5 py-4 text-xs leading-relaxed text-stone-600">
				We usually reply within one business day. For order tracking, you can also use
				<a href="/track-order" class="font-semibold text-olive hover:text-olive-dark">Track Order</a>
				with your order ID.
			</p>
		</div>

		<!-- Form -->
		<div class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8 lg:col-span-3">
			{#if sent}
				<div class="flex min-h-72 flex-col items-center justify-center py-8 text-center">
					<span class="flex h-16 w-16 items-center justify-center rounded-full bg-olive-soft text-olive">
						<Icon name="check-circle" class="h-8 w-8" />
					</span>
					<h2 class="mt-4 text-lg font-bold text-ink">Thanks! Message received.</h2>
					<p class="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
						We'll get back to you within 24 hours.
					</p>
					<button
						type="button"
						onclick={sendAnother}
						class="mt-6 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Send another message
					</button>
				</div>
			{:else}
				<h2 class="text-lg font-bold text-ink">Send us a message</h2>
				<form class="mt-5 space-y-4" onsubmit={handleSubmit} novalidate>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="contact-name" class="mb-1.5 block text-sm font-medium text-ink">Your name</label>
							<input
								id="contact-name"
								type="text"
								autocomplete="name"
								placeholder="Your full name"
								bind:value={name}
								class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive/20 {errors.name
									? 'border-red-400 focus:border-red-500'
									: 'border-line focus:border-olive'}"
							/>
							{#if errors.name}<p class="mt-1 text-xs text-red-600">{errors.name}</p>{/if}
						</div>
						<div>
							<label for="contact-email" class="mb-1.5 block text-sm font-medium text-ink">Email address</label>
							<input
								id="contact-email"
								type="email"
								autocomplete="email"
								placeholder="you@example.com"
								bind:value={email}
								class="w-full rounded-lg border px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive/20 {errors.email
									? 'border-red-400 focus:border-red-500'
									: 'border-line focus:border-olive'}"
							/>
							{#if errors.email}<p class="mt-1 text-xs text-red-600">{errors.email}</p>{/if}
						</div>
					</div>

					<div>
						<label for="contact-subject" class="mb-1.5 block text-sm font-medium text-ink">Subject</label>
						<select
							id="contact-subject"
							bind:value={subject}
							class="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/20"
						>
							<option>Order question</option>
							<option>Returns</option>
							<option>Product question</option>
							<option>Other</option>
						</select>
					</div>

					<div>
						<label for="contact-message" class="mb-1.5 block text-sm font-medium text-ink">Message</label>
						<textarea
							id="contact-message"
							rows="5"
							placeholder="How can we help you?"
							bind:value={message}
							class="w-full resize-y rounded-lg border px-3.5 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive/20 {errors.message
								? 'border-red-400 focus:border-red-500'
								: 'border-line focus:border-olive'}"
						></textarea>
						{#if errors.message}<p class="mt-1 text-xs text-red-600">{errors.message}</p>{/if}
					</div>

					<button
						type="submit"
						class="inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Send Message <Icon name="arrow-right" class="h-4 w-4" />
					</button>
					<p class="text-xs text-stone-500">Demo form — no email is actually sent.</p>
				</form>
			{/if}
		</div>
	</div>
</section>
