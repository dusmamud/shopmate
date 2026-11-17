<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';
	import { shop, formatPrice, type GiftCard } from '../../lib/data/store.svelte';

	const AMOUNTS = [25, 50, 100, 150];

	let selectedAmount = $state<number | null>(50);
	let customAmount = $state('');
	let toName = $state('');
	let fromName = $state('');
	let message = $state('');
	let buyError = $state('');
	let bought: GiftCard | null = $state(null);

	let checkCode = $state('');
	let checked: GiftCard | 'not-found' | null = $state(null);

	function pickAmount(amount: number) {
		selectedAmount = amount;
		customAmount = '';
		buyError = '';
	}

	function effectiveAmount(): number {
		if (selectedAmount !== null) return selectedAmount;
		const n = Number(customAmount);
		return Number.isFinite(n) ? n : 0;
	}

	function purchase() {
		buyError = '';
		const amount = effectiveAmount();
		if (amount < 5 || amount > 500) {
			buyError = 'Choose an amount between $5 and $500.';
			return;
		}
		if (!toName.trim() || !fromName.trim()) {
			buyError = 'Add who the gift card is to and from.';
			return;
		}
		bought = shop.buyGiftCard(amount, toName, fromName, message);
		shop.showToast('Gift card created');
	}

	function resetBuy() {
		bought = null;
		selectedAmount = 50;
		customAmount = '';
		toName = '';
		fromName = '';
		message = '';
		buyError = '';
	}

	function checkBalance() {
		if (!checkCode.trim()) {
			checked = 'not-found';
			return;
		}
		checked = shop.giftCardByCode(checkCode) ?? 'not-found';
	}
</script>

<svelte:head>
	<title>Gift Cards — ShopMate</title>
	<meta
		name="description"
		content="Give a ShopMate gift card — choose an amount, add a message, and check any gift card balance. Demo only, stored on this device."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Gift Cards' }]} />
	<div class="mt-4" use:reveal>
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Gift Cards</h1>
		<p class="mt-1 max-w-2xl text-sm text-stone-500 sm:text-base">
			The easy gift — pick an amount, add a personal message, and share the code. Gift cards never
			expire and work at checkout on this device.
		</p>
	</div>

	<div class="mt-8 grid gap-6 lg:grid-cols-2">
		<!-- Buy a gift card -->
		<div class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6" use:reveal>
			{#if bought}
				<div class="text-center">
					<div
						class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive-soft text-olive"
					>
						<Icon name="check-circle" class="h-7 w-7" />
					</div>
					<h2 class="mt-4 text-lg font-extrabold text-ink">Your gift card is ready</h2>
					<p class="mt-1 text-sm text-stone-500">
						Share this code with {bought.toName} — it can be redeemed at checkout.
					</p>

					<!-- Gift card visual -->
					<div
						class="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-olive via-[#6d8444] to-ink p-5 text-left text-white shadow-lg"
					>
						<div class="flex items-start justify-between gap-3">
							<p class="text-xs font-bold tracking-[0.2em] uppercase opacity-80">ShopMate</p>
							<Icon name="credit-card" class="h-6 w-6 opacity-80" />
						</div>
						<p class="mt-6 text-3xl font-extrabold tracking-tight">{formatPrice(bought.amount)}</p>
						<p class="mt-1 text-sm opacity-80">To {bought.toName} · From {bought.fromName}</p>
						<p class="mt-4 font-mono text-sm font-bold tracking-[0.15em]">{bought.code}</p>
						{#if bought.message}
							<p class="mt-2 text-sm italic opacity-90">“{bought.message}”</p>
						{/if}
					</div>

					<p class="mt-4 text-xs text-stone-500">
						Demo only — this card is stored in this browser, and the code works at checkout on this
						device. Use this code at checkout to apply the credit.
					</p>
					<button
						type="button"
						onclick={resetBuy}
						class="press mt-5 inline-flex items-center gap-2 rounded-lg bg-olive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-olive-dark"
					>
						<Icon name="plus" class="h-4 w-4" /> Buy another gift card
					</button>
				</div>
			{:else}
				<h2 class="text-lg font-extrabold text-ink">Buy a gift card</h2>

				<p class="mt-4 text-sm font-semibold text-ink">Choose an amount</p>
				<div class="mt-2 grid grid-cols-4 gap-2">
					{#each AMOUNTS as amount}
						<button
							type="button"
							onclick={() => pickAmount(amount)}
							aria-pressed={selectedAmount === amount}
							class="press rounded-lg border-2 px-2 py-3 text-sm font-bold transition {selectedAmount ===
							amount
								? 'border-olive bg-olive-soft text-olive'
								: 'border-line bg-white text-ink hover:border-olive/50'}"
						>
							{formatPrice(amount)}
						</button>
					{/each}
				</div>
				<div class="mt-2">
					<label for="custom-amount" class="sr-only">Custom amount</label>
					<input
						id="custom-amount"
						type="number"
						min="5"
						max="500"
						inputmode="decimal"
						placeholder="Or enter a custom amount ($5–$500)"
						bind:value={customAmount}
						onfocus={() => (selectedAmount = null)}
						class="w-full rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
					/>
				</div>

				<!-- Live preview -->
				<div
					class="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-olive via-[#6d8444] to-ink p-5 text-white shadow"
				>
					<div class="flex items-start justify-between gap-3">
						<p class="text-xs font-bold tracking-[0.2em] uppercase opacity-80">ShopMate</p>
						<Icon name="credit-card" class="h-6 w-6 opacity-80" />
					</div>
					<p class="mt-6 text-3xl font-extrabold tracking-tight">
						{formatPrice(effectiveAmount())}
					</p>
					<p class="mt-1 text-sm opacity-80">
						To {toName.trim() || 'Someone special'} · From {fromName.trim() || 'You'}
					</p>
					<p class="mt-4 font-mono text-sm font-bold tracking-[0.15em] opacity-60">SMGC-••••••</p>
				</div>

				<div class="mt-5 space-y-3">
					<div>
						<label for="gc-to" class="mb-1 block text-sm font-semibold text-ink">To</label>
						<input
							id="gc-to"
							type="text"
							bind:value={toName}
							placeholder="Recipient's name"
							maxlength="40"
							class="w-full rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
						/>
					</div>
					<div>
						<label for="gc-from" class="mb-1 block text-sm font-semibold text-ink">From</label>
						<input
							id="gc-from"
							type="text"
							bind:value={fromName}
							placeholder="Your name"
							maxlength="40"
							class="w-full rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
						/>
					</div>
					<div>
						<label for="gc-message" class="mb-1 block text-sm font-semibold text-ink"
							>Message <span class="font-normal text-stone-400">(optional)</span></label
						>
						<textarea
							id="gc-message"
							bind:value={message}
							rows="2"
							placeholder="A short note for the recipient"
							maxlength="140"
							class="w-full resize-none rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
						></textarea>
					</div>
				</div>

				{#if buyError}
					<p class="mt-3 flex items-start gap-1.5 text-sm text-red-600">
						<Icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" /> {buyError}
					</p>
				{/if}

				<button
					type="button"
					onclick={purchase}
					class="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-olive px-5 py-3 text-sm font-semibold text-white transition hover:bg-olive-dark"
				>
					<Icon name="credit-card" class="h-4 w-4" />
					Purchase gift card — {formatPrice(effectiveAmount())}
				</button>
				<p class="mt-2 text-center text-xs text-stone-400">
					Demo checkout — no real payment is taken. The card is stored in this browser only.
				</p>
			{/if}
		</div>

		<!-- Check balance -->
		<div class="space-y-6">
			<div class="rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-6" use:reveal>
				<h2 class="text-lg font-extrabold text-ink">Check your balance</h2>
				<p class="mt-1 text-sm text-stone-500">
					Enter the code from your gift card to see its remaining balance.
				</p>
				<div class="mt-4 flex gap-2">
					<label for="gc-code" class="sr-only">Gift card code</label>
					<input
						id="gc-code"
						type="text"
						bind:value={checkCode}
						onkeydown={(e) => {
							if (e.key === 'Enter') checkBalance();
						}}
						placeholder="e.g. SMGC-ABC123"
						autocomplete="off"
						class="min-w-0 flex-1 rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 font-mono text-sm text-ink uppercase outline-none placeholder:text-stone-400 focus:border-olive"
					/>
					<button
						type="button"
						onclick={checkBalance}
						class="press shrink-0 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
					>
						Check
					</button>
				</div>

				{#if checked === 'not-found'}
					<p class="mt-4 flex items-start gap-1.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
						<Icon name="alert" class="mt-0.5 h-4 w-4 shrink-0" />
						<span>
							We couldn't find a gift card with that code on this device. Check the code and try
							again — codes bought on another device or browser won't appear here.
						</span>
					</p>
				{:else if checked}
					<div class="mt-4 rounded-xl bg-olive-soft/70 px-4 py-3">
						<p class="flex items-start gap-1.5 text-sm text-ink">
							<Icon name="check-circle" class="mt-0.5 h-4 w-4 shrink-0 text-olive" />
							<span>
								<strong>{checked.code}</strong> — balance
								<strong>{formatPrice(checked.balance)}</strong>
								{#if checked.balance < checked.amount}
									<span class="text-stone-500">
										(of {formatPrice(checked.amount)} originally)
									</span>
								{/if}
								<br />
								<span class="text-stone-500">
									To {checked.toName} · From {checked.fromName}
								</span>
							</span>
						</p>
					</div>
				{/if}
			</div>

			<div class="rounded-2xl border border-dashed border-olive/50 bg-olive-soft/60 p-5" use:reveal>
				<p class="flex items-center gap-2 text-sm font-semibold text-ink">
					<Icon name="tag" class="h-4 w-4 text-olive" /> How gift cards work
				</p>
				<ul class="mt-2.5 space-y-1.5 text-sm text-stone-600">
					<li>· Gift cards never expire and can be used in parts across orders.</li>
					<li>· Redeem the code at checkout — the credit comes off your order total.</li>
					<li>· Codes are stored only in this browser, so keep the code safe.</li>
					<li>· This is a demo store: no real money moves, and cards work on this device only.</li>
				</ul>
			</div>
		</div>
	</div>
</section>
