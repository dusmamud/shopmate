<script lang="ts">
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import { reveal } from '../../lib/actions/reveal';
	import { products } from '../../lib/data/products';

	type Group = { title: string; links: { label: string; href: string }[] };

	const groups: Group[] = [
		{
			title: 'Shop',
			links: [
				{ label: 'All Products', href: '/shop' },
				{ label: 'Deals', href: '/deals' },
				{ label: 'New Arrivals', href: '/new-arrivals' },
				{ label: 'Best Sellers', href: '/best-sellers' },
				{ label: 'Shop by Category', href: '/categories' },
				{ label: 'Shop by Brand', href: '/brands' },
				{ label: 'Compare Products', href: '/compare' },
				{ label: 'Gift Cards', href: '/gift-cards' },
				...products.map((p) => ({ label: p.name, href: `/product/${p.id}` }))
			]
		},
		{
			title: 'Account',
			links: [
				{ label: 'Log In', href: '/login' },
				{ label: 'Sign Up', href: '/signup' },
				{ label: 'My Account', href: '/account' },
				{ label: 'My Orders', href: '/orders' },
				{ label: 'Track Order', href: '/track-order' },
				{ label: 'Wishlist', href: '/wishlist' },
				{ label: 'Recently Viewed', href: '/recently-viewed' },
				{ label: 'Cart', href: '/cart' },
				{ label: 'Checkout', href: '/checkout' }
			]
		},
		{
			title: 'Help',
			links: [
				{ label: 'Help Center', href: '/help' },
				{ label: 'Contact Us', href: '/contact' },
				{ label: 'Shipping Policy', href: '/shipping-policy' },
				{ label: 'Returns Policy', href: '/returns-policy' },
				{ label: 'Accessibility', href: '/accessibility' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About Us', href: '/about' },
				{ label: 'Blog', href: '/blog' },
				{ label: 'Careers', href: '/careers' },
				{ label: 'Sitemap', href: '/sitemap' }
			]
		},
		{
			title: 'Legal',
			links: [
				{ label: 'Privacy Policy', href: '/privacy-policy' },
				{ label: 'Terms of Service', href: '/terms' },
				{ label: 'Cookie Policy', href: '/cookie-policy' }
			]
		}
	];
</script>

<svelte:head>
	<title>Sitemap — ShopMate</title>
	<meta
		name="description"
		content="Every page on ShopMate, grouped by section — shop, account, help, company and legal."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<Breadcrumbs items={[{ label: 'Sitemap' }]} />
	<div class="mt-4" use:reveal>
		<h1 class="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Sitemap</h1>
		<p class="mt-1 max-w-2xl text-sm text-stone-500 sm:text-base">
			Every page on ShopMate, grouped by section.
		</p>
	</div>

	<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		{#each groups as group, i (group.title)}
			<div
				style="--i: {i}"
				class="card-in min-w-0 rounded-2xl border border-line bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
			>
				<h2 class="text-base font-extrabold text-ink">{group.title}</h2>
				<ul class="mt-3 space-y-2">
					{#each group.links as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-stone-600 transition hover:text-olive hover:underline"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>
