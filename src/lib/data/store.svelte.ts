// Shared shop state (Svelte 5 runes): cart count, wishlist and header search.
// A singleton class instance, so Header and the product grid stay in sync.
class ShopState {
	cartCount = $state(0);
	wishlist = $state(new Set<number>());
	search = $state('');

	addToCart() {
		this.cartCount += 1;
	}

	toggleWishlist(id: number) {
		if (this.wishlist.has(id)) this.wishlist.delete(id);
		else this.wishlist.add(id);
		// Re-assign so Svelte 5 tracks the Set change.
		this.wishlist = new Set(this.wishlist);
	}

	isWished(id: number) {
		return this.wishlist.has(id);
	}
}

export const shop = new ShopState();
