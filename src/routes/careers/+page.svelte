<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';

	type Role = {
		title: string;
		location: string;
		type: string;
		salary: string;
		about: string;
		points: string[];
	};

	const roles: Role[] = [
		{
			title: 'Store Manager',
			location: 'Mumbai, India',
			type: 'Full-time · On-site',
			salary: '$45,000 – $60,000 / year',
			about:
				'Own the day-to-day running of the ShopMate store: the team, the shelves, the customer experience and the numbers behind them.',
			points: [
				'Lead a team of 8 across sales floor and stockroom',
				'Own weekly targets, rosters and merchandising',
				'3+ years in retail leadership, or equivalent experience'
			]
		},
		{
			title: 'Customer Support Specialist',
			location: 'Remote (India)',
			type: 'Full-time · Remote',
			salary: '$22,000 – $30,000 / year',
			about:
				'Be the friendly voice of ShopMate: help customers with orders, deliveries, returns and gift cards — over chat and email.',
			points: [
				'Answer customer chats and emails within the hour',
				'Own issues end to end, from first message to fix',
				'Great written English; patience and a calm tone'
			]
		},
		{
			title: 'Warehouse Associate',
			location: 'Bengaluru, India',
			type: 'Full-time · On-site',
			salary: '$18,000 – $24,000 / year',
			about:
				'Keep orders moving: pick, pack and ship with care so every parcel leaves on time and in perfect shape.',
			points: [
				'Pick, pack and label 100+ orders a day',
				'Keep stock counts accurate and shelves tidy',
				'Comfortable on your feet; forklift licence a plus'
			]
		}
	];

	let selected: string | null = $state(null);
	let applicantName = $state('');
	let applicantEmail = $state('');
	let coverNote = $state('');
	let formError = $state('');
	let submittedFor: string | null = $state(null);

	function openForm(role: string) {
		selected = role;
		submittedFor = null;
		formError = '';
	}

	function submitApplication(role: string) {
		formError = '';
		if (applicantName.trim().length < 2) {
			formError = 'Please enter your full name.';
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail.trim())) {
			formError = 'Please enter a valid email address.';
			return;
		}
		if (coverNote.trim().length < 10) {
			formError = 'Tell us a little about yourself — at least a few words.';
			return;
		}
		submittedFor = role;
		selected = null;
		applicantName = '';
		applicantEmail = '';
		coverNote = '';
	}
</script>

<svelte:head>
	<title>Careers — ShopMate</title>
	<meta
		name="description"
		content="Work at ShopMate — open roles in store management, customer support and the warehouse. Demo listings; applications are not really sent anywhere."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Careers' }]} />
	<div class="mt-4" use:reveal>
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Careers at ShopMate</h1>
		<p class="mt-1 max-w-2xl text-sm text-stone-500 sm:text-base">
			We are a small team that cares about good products and happy customers. These are demo
			listings — applications are not really sent anywhere.
		</p>
	</div>

	<div class="mt-8 grid gap-5 lg:grid-cols-3">
		{#each roles as role, i (role.title)}
			<article
				style="--i: {i}"
				class="card-in flex min-w-0 flex-col rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6"
			>
				<h2 class="text-lg font-extrabold text-ink">{role.title}</h2>
				<div class="mt-2 flex flex-wrap gap-2 text-xs">
					<span
						class="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 font-semibold text-stone-600"
					>
						<Icon name="pin" class="h-3.5 w-3.5" /> {role.location}
					</span>
					<span
						class="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 font-semibold text-stone-600"
					>
						<Icon name="clock" class="h-3.5 w-3.5" /> {role.type}
					</span>
					<span
						class="inline-flex items-center gap-1 rounded-full bg-olive-soft px-2.5 py-1 font-semibold text-olive"
					>
						<Icon name="tag" class="h-3.5 w-3.5" /> {role.salary}
					</span>
				</div>
				<p class="mt-3 text-sm leading-relaxed text-stone-600">{role.about}</p>
				<ul class="mt-3 flex-1 space-y-1.5 text-sm text-stone-600">
					{#each role.points as point}
						<li class="flex items-start gap-2">
							<Icon name="check" class="mt-0.5 h-4 w-4 shrink-0 text-olive" /> {point}
						</li>
					{/each}
				</ul>

				{#if submittedFor === role.title}
					<div
						class="mt-5 flex items-start gap-2 rounded-xl bg-olive-soft/70 px-4 py-3 text-sm text-ink"
					>
						<Icon name="check-circle" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
						<span>
							<strong>Application received (demo).</strong> Thanks for your interest in the {role.title}
							role — nothing was sent anywhere, this is a demo form.
						</span>
					</div>
				{:else if selected === role.title}
					<form
						class="mt-5 space-y-3 border-t border-line pt-5"
						onsubmit={(e) => {
							e.preventDefault();
							submitApplication(role.title);
						}}
					>
						<p class="text-sm font-bold text-ink">Apply for {role.title}</p>
						<div>
							<label for="app-name-{i}" class="mb-1 block text-sm font-semibold text-ink"
								>Full name</label
							>
							<input
								id="app-name-{i}"
								type="text"
								bind:value={applicantName}
								placeholder="Your name"
								autocomplete="name"
								class="w-full rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
							/>
						</div>
						<div>
							<label for="app-email-{i}" class="mb-1 block text-sm font-semibold text-ink"
								>Email</label
							>
							<input
								id="app-email-{i}"
								type="email"
								bind:value={applicantEmail}
								placeholder="you@example.com"
								autocomplete="email"
								class="w-full rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
							/>
						</div>
						<div>
							<label for="app-note-{i}" class="mb-1 block text-sm font-semibold text-ink"
								>Cover note</label
							>
							<textarea
								id="app-note-{i}"
								bind:value={coverNote}
								rows="3"
								placeholder="Why are you a good fit for this role?"
								class="w-full resize-none rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
							></textarea>
						</div>
						{#if formError}
							<p class="flex items-start gap-1.5 text-sm text-red-600">
								<Icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" /> {formError}
							</p>
						{/if}
						<div class="flex gap-2">
							<button
								type="submit"
								class="press flex flex-1 items-center justify-center gap-2 rounded-lg bg-olive px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
							>
								<Icon name="mail" class="h-4 w-4" /> Submit application
							</button>
							<button
								type="button"
								onclick={() => (selected = null)}
								class="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 transition hover:border-olive"
							>
								Cancel
							</button>
						</div>
						<p class="text-xs text-stone-400">Demo only — your details stay in this browser.</p>
					</form>
				{:else}
					<button
						type="button"
						onclick={() => openForm(role.title)}
						class="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						Apply <Icon name="arrow-right" class="h-4 w-4" />
					</button>
				{/if}
			</article>
		{/each}
	</div>

	<p class="mt-8 rounded-2xl border border-dashed border-line bg-cream px-6 py-5 text-center text-sm text-stone-500">
		Don't see a role for you? Write to
		<a href="mailto:careers@shopmate.store" class="font-semibold text-olive hover:text-olive-dark"
			>careers@shopmate.store</a
		>
		— we keep promising applications on file.
	</p>
</section>
