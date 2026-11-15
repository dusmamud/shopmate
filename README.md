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

All visuals are generated for this site — no stock photos:

- `static/hero.webp`, `static/offer.webp`, `static/product-headphones.webp`, `static/product-backpack.webp` — AI-generated product photography
- `src/lib/components/Art.svelte` — hand-drawn flat SVG illustrations for categories and the smartwatch / shoes / perfume products
- `src/lib/components/Icon.svelte` — real SVG icons throughout (no emoji)
- Avatars are initial monograms, generated in code
