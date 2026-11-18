<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '#lib/components/Icon.svelte';
	import { shop } from '../../lib/data/store.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirm = $state('');
	let terms = $state(false);
	let showPassword = $state(false);
	let showConfirm = $state(false);
	let errors = $state<{ name?: string; email?: string; password?: string; confirm?: string; terms?: string }>({});
	let serverError = $state('');

	const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

	const strength = $derived(
		password.length === 0
			? ''
			: password.length < 6
				? 'Too short — at least 6 characters'
				: password.length < 9
					? 'Fair — add more characters for a stronger password'
					: password.length < 12
						? 'Good password'
						: 'Strong password'
	);

	const strengthColor = $derived(
		password.length === 0
			? ''
			: password.length < 6
				? 'text-red-600'
				: password.length < 9
					? 'text-amber-600'
					: 'text-olive'
	);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		errors = {};
		serverError = '';
		if (!name.trim()) errors.name = 'Please enter your full name.';
		if (!emailOk(email)) errors.email = 'Enter a valid email address.';
		if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
		if (confirm !== password) errors.confirm = 'Passwords do not match.';
		if (!terms) errors.terms = 'Please agree to the Terms and Privacy Policy to continue.';
		if (Object.keys(errors).length > 0) return;

		const res = shop.signup(name, email, password);
		if (!res.ok) {
			serverError = res.error ?? 'Could not create your account. Please try again.';
			return;
		}
		goto('/account');
	}
</script>

<svelte:head>
	<title>Create Account — ShopMate</title>
	<meta
		name="description"
		content="Create your free ShopMate account today for faster checkout, order tracking and saved favourites. Demo store — accounts are saved only on this device."
	/>
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<section class="bg-cream px-4 py-12 sm:py-16">
	<div class="mx-auto max-w-md">
		<div class="rounded-2xl border border-line bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8">
			<div class="flex h-12 w-12 items-center justify-center rounded-full bg-olive-soft text-olive">
				<Icon name="user" class="h-6 w-6" />
			</div>
			<h1 class="mt-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Create your account</h1>
			<p class="mt-1 text-sm text-stone-500">Join ShopMate for faster checkout, order tracking and saved favourites.</p>

			{#if serverError}
				<p class="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
					<Icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />
					{serverError}
				</p>
			{/if}

			<form class="mt-6 space-y-4" onsubmit={handleSubmit} novalidate>
				<div>
					<label for="signup-name" class="mb-1.5 block text-sm font-medium text-ink">Full name</label>
					<input
						id="signup-name"
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
					<label for="signup-email" class="mb-1.5 block text-sm font-medium text-ink">Email address</label>
					<input
						id="signup-email"
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
					<label for="signup-password" class="mb-1.5 block text-sm font-medium text-ink">Password</label>
					<div class="relative">
						<input
							id="signup-password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="new-password"
							placeholder="At least 6 characters"
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
					{#if strength}<p class="mt-1 text-xs {strengthColor}">{strength}</p>{/if}
					{#if errors.password}<p class="mt-1 text-xs text-red-600">{errors.password}</p>{/if}
				</div>

				<div>
					<label for="signup-confirm" class="mb-1.5 block text-sm font-medium text-ink">Confirm password</label>
					<div class="relative">
						<input
							id="signup-confirm"
							type={showConfirm ? 'text' : 'password'}
							autocomplete="new-password"
							placeholder="Repeat your password"
							bind:value={confirm}
							class="w-full rounded-lg border px-3.5 py-2.5 pr-11 text-sm text-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-olive/20 {errors.confirm
								? 'border-red-400 focus:border-red-500'
								: 'border-line focus:border-olive'}"
						/>
						<button
							type="button"
							aria-label={showConfirm ? 'Hide password' : 'Show password'}
							onclick={() => (showConfirm = !showConfirm)}
							class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-stone-500 transition hover:text-ink"
						>
							<Icon name={showConfirm ? 'eye-off' : 'eye'} class="h-5 w-5" />
						</button>
					</div>
					{#if errors.confirm}<p class="mt-1 text-xs text-red-600">{errors.confirm}</p>{/if}
				</div>

				<div>
					<label class="flex cursor-pointer items-start gap-2.5 text-sm text-stone-600">
						<input
							type="checkbox"
							bind:checked={terms}
							class="mt-0.5 h-4 w-4 shrink-0 accent-[#5c7038]"
						/>
						<span>I agree to the Terms and Privacy Policy</span>
					</label>
					{#if errors.terms}<p class="mt-1 text-xs text-red-600">{errors.terms}</p>{/if}
				</div>

				<button
					type="submit"
					class="w-full rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
				>
					Create Account
				</button>
			</form>

			<p class="mt-5 text-center text-sm text-stone-500">
				Already have an account?
				<a href="/login" class="font-semibold text-olive hover:text-olive-dark">Log in</a>
			</p>

			<p class="mt-4 rounded-lg bg-cream px-3 py-2 text-center text-xs text-stone-600">
				Demo store — accounts are saved only on this device.
			</p>
		</div>

		<div class="mt-5 flex items-center justify-center gap-6 text-xs text-stone-500">
			<span class="flex items-center gap-1.5"><Icon name="shield" class="h-4 w-4 text-olive" /> Secure sign up</span>
			<span class="flex items-center gap-1.5"><Icon name="lock" class="h-4 w-4 text-olive" /> Your data stays on this device</span>
		</div>
	</div>
</section>
