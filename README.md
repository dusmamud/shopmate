# ShopMate

E-commerce landing page built same-to-same as the reference design — Svelte 5 + SvelteKit 3 + Vite + TypeScript + Tailwind CSS v4, with `adapter-static` prerendering.

## Run

```bash
npm install
npm run dev     # dev server
npm run build   # static build -> build/
npm run check   # svelte-check
```

## Sections

Header / navbar (sticky, mobile menu + live search) · Hero · Trust bar (Free Shipping, Secure Payment, Easy Returns, 24/7 Support) · Shop by Categories · Best Selling Products (working Add to Cart + wishlist, cart count in header) · Up to 50% Off offer banner · Customer testimonials (carousel on mobile) · Footer with newsletter signup.

## Images

All visuals are AI-generated product photography in `static/` — no stock photos, no illustrations:

- `hero.webp`, `offer.webp`, `product-headphones.webp`, `product-backpack.webp` — hero / banner / product photos
- `product-smartwatch.webp`, `product-shoes.webp`, `product-perfume.webp` — the other three best sellers
- `cat-electronics.webp`, `cat-fashion.webp`, `cat-home.webp`, `cat-beauty.webp`, `cat-sports.webp`, `cat-accessories.webp` — category circle photos
- `avatar-hero-1..4.webp`, `avatar-john.webp`, `avatar-sarah.webp`, `avatar-michael.webp` — real customer headshots

Icons are real SVGs in `src/lib/components/Icon.svelte` (no emoji).

## Shop functionality (all local, no backend)

Full storefront flow, stored in the browser's localStorage:

- **Pages:** Home, Shop (search + category filter + sort), Product detail (`/product/[id]`), Categories, Deals (countdown + discount badges), Cart, Checkout, Order Success, My Orders, Track Order, Login, Sign Up, My Account, Wishlist, Contact, Help (shipping / returns / FAQ)
- **Cart & wishlist:** add to cart with quantity (capped at stock), promo codes `WELCOME10` (10% off) and `FREESHIP` (free shipping), free shipping over $50, wishlist with counts in the header
- **Checkout:** one-page, guest checkout by default (best practice — no forced account), COD / Card / UPI (demo), order summary with full cost before payment
- **Orders:** order IDs like `SMXXXXXXXX`, status timeline (Placed → Processing → Shipped → Out for delivery → Delivered, advancing ~daily), reorder from My Orders
- **Auth:** local demo accounts (passwords hashed, never stored plain) — accounts and orders live only on the device
- **Verification:** Playwright end-to-end test passed 11/11 (signup → login → add to cart → wishlist → promo → checkout logged-in + guest → track order); zero horizontal overflow on 6 key pages at 390px
