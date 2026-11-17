<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from './Icon.svelte';

	type Msg = { from: 'you' | 'bot'; text: string };

	let open = $state(false);
	let input = $state('');
	let typing = $state(false);
	let messages = $state<Msg[]>([
		{
			from: 'bot',
			text: "Hi! I'm ShopMate Support. Ask about shipping, returns, tracking an order, discount codes or gift cards."
		}
	]);
	let panel: HTMLDivElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();
	let replyTimer: ReturnType<typeof setTimeout> | undefined;

	function botReply(text: string): string {
		const t = text.toLowerCase();
		if (/(ship|deliver)/.test(t))
			return 'Delivery is free on orders over $50 (otherwise $4.99) and usually takes 3–4 days. You can check a pincode on any product page before you buy.';
		if (/(return|refund|exchange)/.test(t))
			return 'You can return any item within 30 days for a full refund. Start a return from your Orders page — we email you the return label.';
		if (/(track|where.*order|order.*status|my order)/.test(t))
			return 'To track an order, open Track Order and enter your order id (it starts with SM) or the email you ordered with.';
		if (/(discount|coupon|promo|code|offer)/.test(t))
			return 'Use WELCOME10 for 10% off your first order, or FREESHIP for free shipping with no minimum. Enter the code in your cart before checkout.';
		if (/(hour|open|close|timing|when.*open|support.*time)/.test(t))
			return 'Our support team is available Monday to Saturday, 9am to 6pm. This demo chat replies instantly around the clock.';
		if (/(gift)/.test(t))
			return 'Gift cards are available on the Gift Cards page — choose $25, $50, $100 or $150, or a custom amount, and share the code with the recipient.';
		if (/(human|agent|person|call|phone)/.test(t))
			return 'This is a demo chat with canned answers. For a real person, email hello@shopmate.store or use the Help Center (/help) — we reply within one working day.';
		if (/(hi|hello|hey)\b/.test(t))
			return 'Hello! How can I help — shipping, returns, tracking, a discount code or gift cards?';
		return 'I can help with shipping, returns, tracking an order, discount codes, gift cards and support hours. For anything else, the Help Center (/help) has full guides — or email hello@shopmate.store.';
	}

	function send(e?: Event) {
		e?.preventDefault();
		const text = input.trim();
		if (!text) return;
		messages = [...messages, { from: 'you', text }];
		input = '';
		typing = true;
		clearTimeout(replyTimer);
		replyTimer = setTimeout(() => {
			typing = false;
			messages = [...messages, { from: 'bot', text: botReply(text) }];
			panel?.scrollTo({ top: panel.scrollHeight });
		}, 700);
	}

	function toggle() {
		open = !open;
		if (open) {
			clearTimeout(replyTimer);
			typing = false;
			setTimeout(() => inputEl?.focus(), 50);
		}
	}

	onDestroy(() => clearTimeout(replyTimer));
</script>

<!-- Floating live-chat — mount in +layout when ready. -->
{#if open}
	<div
		class="fixed right-4 bottom-36 z-40 flex h-96 w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
		role="dialog"
		aria-label="ShopMate Support chat"
	>
		<div class="flex items-center justify-between gap-3 bg-olive px-4 py-3 text-white">
			<div class="flex min-w-0 items-center gap-2.5">
				<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
					<Icon name="headset" class="h-5 w-5" />
				</span>
				<div class="min-w-0">
					<p class="truncate text-sm font-bold">ShopMate Support</p>
					<p class="truncate text-xs opacity-80">Replies instantly (demo)</p>
				</div>
			</div>
			<button
				type="button"
				onclick={toggle}
				aria-label="Close chat"
				class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-white/20"
			>
				<Icon name="close" class="h-5 w-5" />
			</button>
		</div>

		<div bind:this={panel} class="flex-1 space-y-2.5 overflow-y-auto bg-cream/60 px-4 py-4">
			{#each messages as m}
				<div class="flex {m.from === 'you' ? 'justify-end' : 'justify-start'}">
					<p
						class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words {m.from ===
						'you'
							? 'rounded-br-md bg-olive text-white'
							: 'rounded-bl-md bg-white text-ink shadow-sm'}"
					>
						{m.text}
					</p>
				</div>
			{/each}
			{#if typing}
				<div class="flex justify-start">
					<p
						class="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-stone-500 shadow-sm"
					>
						<span class="inline-flex gap-1" aria-label="ShopMate Support is typing">
							<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400"></span>
							<span
								class="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:150ms]"
							></span>
							<span
								class="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:300ms]"
							></span>
						</span>
					</p>
				</div>
			{/if}
		</div>

		<form class="flex gap-2 border-t border-line bg-white p-3" onsubmit={send}>
			<label for="livechat-input" class="sr-only">Type your message</label>
			<input
				id="livechat-input"
				bind:this={inputEl}
				bind:value={input}
				type="text"
				placeholder="Ask about shipping, returns, orders…"
				autocomplete="off"
				class="min-w-0 flex-1 rounded-lg border border-line bg-cream/60 px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-stone-400 focus:border-olive"
			/>
			<button
				type="submit"
				disabled={!input.trim()}
				aria-label="Send message"
				class="press flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-olive text-white transition hover:bg-olive-dark disabled:opacity-40"
			>
				<Icon name="arrow-right" class="h-5 w-5" />
			</button>
		</form>
	</div>
{/if}

<button
	type="button"
	onclick={toggle}
	aria-label={open ? 'Close live chat' : 'Open live chat'}
	aria-expanded={open}
	class="press fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-olive text-white shadow-lg transition hover:bg-olive-dark"
>
	<Icon name={open ? 'close' : 'headset'} class="h-6 w-6" />
</button>
