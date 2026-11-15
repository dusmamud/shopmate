<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Icon from '#lib/components/Icon.svelte';
	import { shop } from '../../lib/data/store.svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let errors = $state<{ email?: string; password?: string }>({});
	let serverError = $state('');

	const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = {};
		serverError = '';
		if (!emailOk(email)) errors.email = 'Enter a valid email address.';
		if (!password) errors.password = 'Password is required.';
		if (Object.keys(errors).length > 0) return;

		const res = shop.login(email, password);
		if (!res.ok) {
			serverError = res.error ?? 'Login failed. Please try again.';
			return;
		}
		goto(page.url.searchParams.get('redirect') || '/account');
	}
</script>

<svelte:head>
	<title>Log in — ShopMate</title>
</svelte:head>

<section class="bg-cream px-4 py-12 sm:py-16">
	<div class="mx-auto max-w-md">
		<div class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-olive-soft text-olive">
				<Icon name="user" class="h-6 w-6" />
			</div>
			<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Welcome back</h1>
			<p class="mt-1 text-sm text-stone-500">Log in to your ShopMate account to track orders and check out faster.</p>

			{#if serverError}
				<p class="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
					<Icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />
					{serverError}
				</p>
			{/if}

			<form class="mt-6 space-y-4" onsubmit={handleSubmit} novalidate>
				<div>
					<label for="login-email" class="mb-1.5 block text-sm font-medium text-ink">Email address</label>
					<input
						id="login-email"
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

				<div>
					<label for="login-password" class="mb-1.5 block text-sm font-medium text-ink">Password</label>
					<div class="relative">
						<input
							id="login-password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							placeholder="Your password"
							bind:value={password}
							class="w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive/20 {errors.password
								? 'border-red-400 focus:border-red-500'
								: 'border-line focus:border-olive'}"
						/>
						<button
							type="button"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-stone-500 transition hover:text-ink"
						>
							<Icon name={showPassword ? 'eye-off' : 'eye'} class="h-5 w-5" />
						</button>
					</div>
					{#if errors.password}<p class="mt-1 text-xs text-red-600">{errors.password}</p>{/if}
				</div>

				<button
					type="submit"
					class="w-full rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
				>
					Log in
				</button>
			</form>

			<p class="mt-5 text-center text-sm text-stone-500">
				Don't have an account?
				<a href="/signup" class="font-semibold text-olive hover:text-olive-dark">Sign up</a>
			</p>

			<p class="mt-4 rounded-lg bg-cream px-3 py-2 text-center text-xs text-stone-500">
				Demo store — accounts are saved only on this device.
			</p>
		</div>

		<div class="mt-5 flex items-center justify-center gap-6 text-xs text-stone-500">
			<span class="flex items-center gap-1.5"><Icon name="shield" class="h-4 w-4 text-olive" /> Secure login</span>
			<span class="flex items-center gap-1.5"><Icon name="lock" class="h-4 w-4 text-olive" /> Your data stays on this device</span>
		</div>
	</div>
</section>
