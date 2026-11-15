// Shared shop state (Svelte 5 runes) — cart, wishlist, auth, orders, promo, toast,
// drawer/quick-view UI state, recently viewed and local reviews.
// Everything is stored locally in the browser (localStorage): this is a demo
// storefront with no backend, so orders and accounts live on the device.
// A singleton class instance, so Header, product grids and all pages stay in sync.
import { getProduct, products, type Review } from './products';

export type CartItem = { id: number; qty: number; variant?: string };

export type Address = {
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
};

export type OrderItem = {
	id: number;
	name: string;
	price: number;
	src: string;
	qty: number;
	variant?: string;
};

export type Order = {
	id: string;
	email: string;
	items: OrderItem[];
	subtotal: number;
	discount: number;
	shipping: number;
	total: number;
	address: Address;
	payment: string;
	placedAt: number; // epoch ms
};

export type User = { name: string; email: string; passHash: string };

export const FREE_SHIPPING_OVER = 50;
export const SHIPPING_FEE = 4.99;

/** Demo promo codes: WELCOME10 = 10% off, FREESHIP = free shipping. */
export const PROMOS: Record<string, { type: 'percent' | 'ship'; value: number; label: string }> = {
	WELCOME10: { type: 'percent', value: 10, label: '10% off applied' },
	FREESHIP: { type: 'ship', value: 0, label: 'Free shipping applied' }
};

export const ORDER_STEPS = ['Placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'] as const;

export function formatPrice(n: number): string {
	return '$' + n.toFixed(2);
}

export function formatDate(ts: number): string {
	return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function read<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function write(key: string, value: unknown) {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage full or unavailable — the in-memory state still works.
	}
}

export type AddToCartOpts = { variant?: string; silent?: boolean; openDrawer?: boolean };

class ShopState {
	cart = $state<CartItem[]>([]);
	wishlist = $state<Set<number>>(new Set());
	search = $state('');
	user = $state<User | null>(null);
	orders = $state<Order[]>([]);
	promoCode = $state('');
	toastMsg = $state('');
	toastId = $state(0);

	/** Cart drawer + quick-view modal state (rendered globally in +layout). */
	drawerOpen = $state(false);
	quickViewId = $state<number | null>(null);

	/** Recently viewed product ids, most recent first (max 8). */
	recentIds = $state<number[]>([]);
	/** Reviews written by this user on this device, keyed by product id. */
	private userReviews = $state<Record<number, Review[]>>({});

	private toastTimer: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		this.cart = read<CartItem[]>('shopmate_cart', []);
		this.wishlist = new Set(read<number[]>('shopmate_wishlist', []));
		this.orders = read<Order[]>('shopmate_orders', []);
		this.recentIds = read<number[]>('shopmate_recent', []);
		this.userReviews = read<Record<number, Review[]>>('shopmate_reviews', {});
		const sessionEmail = read<string | null>('shopmate_session', null);
		if (sessionEmail) {
			const users = read<User[]>('shopmate_users', []);
			this.user = users.find((u) => u.email === sessionEmail) ?? null;
		}
	}

	// ---- derived totals ----
	get cartCount(): number {
		return this.cart.reduce((n, item) => n + item.qty, 0);
	}

	get cartSubtotal(): number {
		return this.cart.reduce((sum, item) => {
			const p = getProduct(item.id);
			return sum + (p ? p.price * item.qty : 0);
		}, 0);
	}

	get cartDiscount(): number {
		const promo = PROMOS[this.promoCode];
		if (promo?.type === 'percent') return (this.cartSubtotal * promo.value) / 100;
		return 0;
	}

	get cartShipping(): number {
		if (this.cart.length === 0) return 0;
		if (PROMOS[this.promoCode]?.type === 'ship') return 0;
		return this.cartSubtotal - this.cartDiscount >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
	}

	get cartTotal(): number {
		return Math.max(0, this.cartSubtotal - this.cartDiscount + this.cartShipping);
	}

	get wishlistCount(): number {
		return this.wishlist.size;
	}

	/** Recently viewed products (full objects, most recent first). */
	get recentProducts() {
		return this.recentIds
			.map((id) => getProduct(id))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));
	}

	// ---- cart drawer + quick view ----
	openCart() {
		this.drawerOpen = true;
	}

	closeCart() {
		this.drawerOpen = false;
	}

	openQuickView(id: number) {
		this.quickViewId = id;
	}

	closeQuickView() {
		this.quickViewId = null;
	}

	// ---- cart (variant-aware: same product in two sizes = two lines) ----
	addToCart(id: number, qty = 1, opts: AddToCartOpts = {}) {
		const product = getProduct(id);
		if (!product) return;
		const variant = opts.variant ?? product.option.choices[0];
		const line = this.cart.find((c) => c.id === id && (c.variant ?? '') === (variant ?? ''));
		const nextQty = (line?.qty ?? 0) + qty;
		if (line) line.qty = Math.min(nextQty, product.stock);
		else this.cart.push({ id, qty: Math.min(qty, product.stock), variant });
		this.cart = [...this.cart];
		write('shopmate_cart', this.cart);
		if (opts.silent) return;
		if (opts.openDrawer === false) {
			this.showToast(`${product.name} added to cart`);
		} else {
			// Big-store pattern: adding opens the cart drawer as confirmation.
			this.drawerOpen = true;
		}
	}

	updateQty(id: number, qty: number, variant?: string) {
		const product = getProduct(id);
		if (!product) return;
		if (qty <= 0) return this.removeFromCart(id, variant);
		const line = this.cart.find((c) => c.id === id && (c.variant ?? '') === (variant ?? ''));
		if (line) line.qty = Math.min(qty, product.stock);
		this.cart = [...this.cart];
		write('shopmate_cart', this.cart);
	}

	removeFromCart(id: number, variant?: string) {
		this.cart = this.cart.filter((c) => !(c.id === id && (c.variant ?? '') === (variant ?? '')));
		write('shopmate_cart', this.cart);
	}

	clearCart() {
		this.cart = [];
		this.promoCode = '';
		write('shopmate_cart', this.cart);
	}

	// ---- wishlist ----
	toggleWishlist(id: number) {
		const product = getProduct(id);
		if (this.wishlist.has(id)) {
			this.wishlist.delete(id);
			if (product) this.showToast(`${product.name} removed from wishlist`);
		} else {
			this.wishlist.add(id);
			if (product) this.showToast(`${product.name} saved to wishlist`);
		}
		this.wishlist = new Set(this.wishlist);
		write('shopmate_wishlist', [...this.wishlist]);
	}

	isWished(id: number) {
		return this.wishlist.has(id);
	}

	// ---- recently viewed ----
	trackView(id: number) {
		this.recentIds = [id, ...this.recentIds.filter((x) => x !== id)].slice(0, 8);
		write('shopmate_recent', this.recentIds);
	}

	// ---- reviews (local: seed reviews + ones the user writes on this device) ----
	getReviews(id: number): Review[] {
		const product = getProduct(id);
		return [...(this.userReviews[id] ?? []), ...(product?.seedReviews ?? [])];
	}

	addReview(id: number, review: Omit<Review, 'date'>) {
		const full: Review = { ...review, date: formatDate(Date.now()) };
		this.userReviews[id] = [full, ...(this.userReviews[id] ?? [])];
		write('shopmate_reviews', this.userReviews);
	}

	// ---- promo ----
	applyPromo(code: string): boolean {
		const key = code.trim().toUpperCase();
		if (PROMOS[key]) {
			this.promoCode = key;
			this.showToast(PROMOS[key].label);
			return true;
		}
		return false;
	}

	clearPromo() {
		this.promoCode = '';
	}

	// ---- toast ----
	showToast(msg: string) {
		this.toastMsg = msg;
		this.toastId += 1;
		clearTimeout(this.toastTimer);
		this.toastTimer = setTimeout(() => {
			this.toastMsg = '';
		}, 2600);
	}

	// ---- auth (local demo accounts; passwords are hashed, never stored plain) ----
	private hashPass(pw: string): string {
		let h = 5381;
		for (let i = 0; i < pw.length; i++) h = ((h << 5) + h + pw.charCodeAt(i)) >>> 0;
		return 'djb2-' + h.toString(16);
	}

	signup(name: string, email: string, password: string): { ok: boolean; error?: string } {
		const cleanEmail = email.trim().toLowerCase();
		const users = read<User[]>('shopmate_users', []);
		if (users.some((u) => u.email === cleanEmail)) {
			return { ok: false, error: 'An account with this email already exists. Try logging in.' };
		}
		const user: User = { name: name.trim(), email: cleanEmail, passHash: this.hashPass(password) };
		users.push(user);
		write('shopmate_users', users);
		write('shopmate_session', cleanEmail);
		this.user = user;
		this.showToast(`Welcome to ShopMate, ${user.name}!`);
		return { ok: true };
	}

	login(email: string, password: string): { ok: boolean; error?: string } {
		const cleanEmail = email.trim().toLowerCase();
		const users = read<User[]>('shopmate_users', []);
		const user = users.find((u) => u.email === cleanEmail);
		if (!user || user.passHash !== this.hashPass(password)) {
			return { ok: false, error: 'Incorrect email or password. Please try again.' };
		}
		write('shopmate_session', cleanEmail);
		this.user = user;
		this.showToast(`Welcome back, ${user.name}!`);
		return { ok: true };
	}

	logout() {
		write('shopmate_session', null);
		this.user = null;
		this.showToast('You have been logged out.');
	}

	// ---- orders ----
	placeOrder(address: Address, payment: string): Order | null {
		if (this.cart.length === 0) return null;
		const items: OrderItem[] = this.cart
			.map((c): OrderItem | null => {
				const p = getProduct(c.id);
				return p
					? { id: p.id, name: p.name, price: p.price, src: p.src, qty: c.qty, variant: c.variant }
					: null;
			})
			.filter((x): x is OrderItem => x !== null);
		const order: Order = {
			id: 'SM' + Date.now().toString(36).toUpperCase(),
			email: address.email.trim().toLowerCase(),
			items,
			subtotal: this.cartSubtotal,
			discount: this.cartDiscount,
			shipping: this.cartShipping,
			total: this.cartTotal,
			address,
			payment,
			placedAt: Date.now()
		};
		this.orders = [order, ...this.orders];
		write('shopmate_orders', this.orders);
		this.clearCart();
		return order;
	}

	myOrders(): Order[] {
		if (!this.user) return [];
		return this.orders.filter((o) => o.email === this.user!.email);
	}

	findOrder(id: string): Order | undefined {
		return this.orders.find((o) => o.id.toUpperCase() === id.trim().toUpperCase());
	}

	/** Demo fulfilment timeline: an order moves one step roughly every day. */
	orderStep(order: Order): number {
		const hours = (Date.now() - order.placedAt) / 3_600_000;
		if (hours < 1) return 0;
		if (hours < 24) return 1;
		if (hours < 72) return 2;
		if (hours < 96) return 3;
		return 4;
	}

	estimatedDelivery(order: Order): string {
		return formatDate(order.placedAt + 4 * 24 * 3_600_000);
	}
}

export const shop = new ShopState();

export { products };
