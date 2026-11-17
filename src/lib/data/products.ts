export type Review = {
	name: string;
	rating: number;
	date: string;
	title: string;
	text: string;
	/** Demo seed count of "helpful" votes for this review. */
	helpful?: number;
};

export type QA = { q: string; a: string };

export type Product = {
	id: number;
	name: string;
	price: number;
	oldPrice: number;
	rating: number;
	reviews: number;
	category: string;
	/** Demo brand (used by the Brands page + shop brand filter). */
	brand: string;
	/** Flagged as a new arrival. */
	isNew?: boolean;
	stock: number;
	desc: string;
	/** AI-generated product photo in /static */
	src: string;
	/** Gallery: main photo + alternate angles */
	images: string[];
	highlights: string[];
	specs: { label: string; value: string }[];
	/** Single variant group (buttons, not a dropdown) */
	option: { label: string; choices: string[] };
	seedReviews: Review[];
	qa: QA[];
};

export const products: Product[] = [
	{
		id: 1,
		name: 'Smart Watch Series 5',
		price: 89.99,
		oldPrice: 129.99,
		rating: 4.5,
		reviews: 128,
		category: 'Electronics',
		brand: 'Nova',
		stock: 14,
		desc: 'Stay connected on the go with a bright AMOLED display, heart-rate and sleep tracking, 7-day battery life and 50m water resistance.',
		src: '/product-smartwatch.webp',
		images: ['/product-smartwatch.webp', '/product-smartwatch-2.webp'],
		highlights: [
			'1.43" AMOLED display, always-on watch faces',
			'Heart-rate, SpO2 and sleep tracking with the companion app',
			'7-day battery life, 50m water resistant',
			'Bluetooth calling with built-in mic and speaker'
		],
		specs: [
			{ label: 'Display', value: '1.43" AMOLED, 466 × 466 px' },
			{ label: 'Battery', value: 'Up to 7 days (typical use)' },
			{ label: 'Water resistance', value: '5 ATM (50m)' },
			{ label: 'Connectivity', value: 'Bluetooth 5.3, Android & iOS' },
			{ label: 'In the box', value: 'Watch, strap, magnetic charger, manual' }
		],
		option: { label: 'Strap color', choices: ['Black', 'Olive', 'Cream'] },
		seedReviews: [
			{
				name: 'Rohan K.',
				rating: 5,
				helpful: 12,
				date: 'Nov 2, 2026',
				title: 'Excellent value for money',
				text: 'Battery easily lasts a full week and the display is bright even in sunlight. Sleep tracking is surprisingly accurate.'
			},
			{
				name: 'Priya S.',
				rating: 4,
				helpful: 5,
				date: 'Oct 18, 2026',
				title: 'Great watch, app could be better',
				text: 'The watch itself is fantastic for the price. The companion app takes a little getting used to, but everything works.'
			}
		],
		qa: [
			{
				q: 'Does it work with iPhone?',
				a: 'Yes, it pairs with iPhone (iOS 13+) and Android (8.0+) over Bluetooth 5.3.'
			},
			{
				q: 'Can I swim with it?',
				a: 'Yes, it is rated 5 ATM, so swimming and showers are fine. Avoid hot water and diving.'
			}
		]
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		price: 59.99,
		oldPrice: 89.99,
		rating: 4.7,
		reviews: 98,
		category: 'Electronics',
		brand: 'Aural',
		stock: 22,
		desc: 'Immersive sound with active noise cancellation, 40-hour battery life, plush memory-foam earcups and Bluetooth 5.3 multipoint pairing.',
		src: '/product-headphones.webp',
		images: ['/product-headphones.webp', '/product-headphones-2.webp'],
		highlights: [
			'Active noise cancellation with transparency mode',
			'40-hour battery life (ANC on), quick charge: 10 min = 5 hours',
			'Memory-foam earcups, foldable design with travel case',
			'Bluetooth 5.3 multipoint — connect two devices at once'
		],
		specs: [
			{ label: 'Driver', value: '40 mm dynamic, 20 Hz – 20 kHz' },
			{ label: 'Battery', value: '40 hours (ANC on), 60 hours (ANC off)' },
			{ label: 'Charging', value: 'USB-C, full charge in 1.5 hours' },
			{ label: 'Weight', value: '254 g' },
			{ label: 'In the box', value: 'Headphones, travel case, USB-C cable, 3.5 mm cable' }
		],
		option: { label: 'Color', choices: ['Cream', 'Black', 'Olive'] },
		seedReviews: [
			{
				name: 'Aarav M.',
				rating: 5,
				helpful: 8,
				date: 'Nov 8, 2026',
				title: 'Best headphones under $60',
				text: 'ANC works really well on flights and the sound is warm with good bass. Very comfortable for long sessions.'
			},
			{
				name: 'Neha T.',
				rating: 4,
				helpful: 3,
				date: 'Oct 27, 2026',
				title: 'Sound is great, mic is average',
				text: 'Music and movies sound excellent. Call quality indoors is fine, a bit thin outdoors in wind.'
			}
		],
		qa: [
			{
				q: 'Do they work wired as well?',
				a: 'Yes, a 3.5 mm cable is included, so you can use them wired with ANC off.'
			},
			{
				q: 'How long does the battery last?',
				a: 'About 40 hours with ANC on and 60 hours with ANC off at moderate volume.'
			}
		]
	},
	{
		id: 3,
		name: 'Travel Backpack',
		price: 39.99,
		oldPrice: 69.99,
		rating: 4.6,
		reviews: 156,
		category: 'Accessories',
		brand: 'Trekker',
		stock: 30,
		desc: 'A rugged 22L everyday carry backpack in water-resistant olive canvas, with a padded 15.6" laptop sleeve and anti-theft pocket.',
		src: '/product-backpack.webp',
		images: ['/product-backpack.webp', '/product-backpack-2.webp'],
		highlights: [
			'22L water-resistant canvas with YKK zippers',
			'Padded 15.6" laptop sleeve + hidden anti-theft pocket',
			'Padded shoulder straps and breathable back panel',
			'Luggage strap fits over cabin-bag handles'
		],
		specs: [
			{ label: 'Capacity', value: '22 litres' },
			{ label: 'Dimensions', value: '45 × 30 × 15 cm' },
			{ label: 'Material', value: '900D water-resistant polyester canvas' },
			{ label: 'Laptop sleeve', value: 'Fits up to 15.6"' },
			{ label: 'Weight', value: '0.9 kg' }
		],
		option: { label: 'Color', choices: ['Olive', 'Black', 'Sand'] },
		seedReviews: [
			{
				name: 'Vikram R.',
				rating: 5,
				helpful: 14,
				date: 'Nov 5, 2026',
				title: 'Survived a monsoon trek',
				text: 'Used it daily for two months including a rainy trek — everything inside stayed dry. Zippers feel premium.'
			},
			{
				name: 'Sara L.',
				rating: 5,
				helpful: 6,
				date: 'Oct 12, 2026',
				title: 'Perfect cabin bag',
				text: 'Fits under the seat, laptop sleeve is well padded, and the hidden pocket is great for a passport.'
			}
		],
		qa: [
			{
				q: 'Will a 15.6" laptop fit?',
				a: 'Yes, the padded sleeve fits laptops up to 15.6" plus a tablet in the front pocket.'
			},
			{
				q: 'Is it fully waterproof?',
				a: 'It is water-resistant and handles heavy rain well, but it is not submersible.'
			}
		]
	},
	{
		id: 4,
		name: 'Running Shoes',
		price: 49.99,
		oldPrice: 79.99,
		rating: 4.4,
		reviews: 78,
		category: 'Sports',
		brand: 'Stride',
		isNew: true,
		stock: 18,
		desc: 'Featherlight mesh running shoes with responsive foam cushioning, breathable knit upper and grippy outsole for road and trail.',
		src: '/product-shoes.webp',
		images: ['/product-shoes.webp', '/product-shoes-2.webp'],
		highlights: [
			'Responsive foam midsole for soft landings',
			'Breathable engineered mesh upper',
			'Grippy rubber outsole for road and light trail',
			'Only 240 g (UK 8) — featherlight feel'
		],
		specs: [
			{ label: 'Upper', value: 'Engineered mesh, seamless' },
			{ label: 'Midsole', value: 'EVA responsive foam' },
			{ label: 'Outsole', value: 'Rubber, road + light trail' },
			{ label: 'Drop', value: '8 mm heel-to-toe' },
			{ label: 'Weight', value: '240 g (UK 8)' }
		],
		option: { label: 'Size (UK)', choices: ['6', '7', '8', '9', '10'] },
		seedReviews: [
			{
				name: 'Kabir D.',
				rating: 5,
				helpful: 9,
				date: 'Nov 1, 2026',
				title: 'Super comfortable for daily runs',
				text: 'I run 5 km most mornings — great cushioning, no blisters, and they stay cool. True to size.'
			},
			{
				name: 'Anita J.',
				rating: 4,
				helpful: 4,
				date: 'Oct 20, 2026',
				title: 'Light and comfy',
				text: 'Very light on the feet and the mesh breathes well. The white color gets dirty fast, so keep that in mind.'
			}
		],
		qa: [
			{
				q: 'Are these true to size?',
				a: 'Yes, most buyers find them true to size. If you are between sizes, go half a size up.'
			},
			{
				q: 'Can I use them for gym workouts?',
				a: 'Yes, they work well for gym and walking too, though they are tuned for running.'
			}
		]
	},
	{
		id: 5,
		name: 'Luxury Perfume',
		price: 29.99,
		oldPrice: 49.99,
		rating: 4.8,
		reviews: 64,
		category: 'Beauty',
		brand: 'Elan',
		stock: 25,
		desc: 'An elegant eau de parfum with notes of bergamot, jasmine and warm sandalwood. Long-lasting, 50ml glass bottle with a silver cap.',
		src: '/product-perfume.webp',
		images: ['/product-perfume.webp', '/product-perfume-2.webp'],
		highlights: [
			'Top: bergamot & pink pepper, Heart: jasmine & rose',
			'Base: sandalwood & musk — lasts 8+ hours',
			'Eau de parfum, 50 ml glass bottle with silver cap',
			'Cruelty-free, made in small batches'
		],
		specs: [
			{ label: 'Type', value: 'Eau de parfum' },
			{ label: 'Size', value: '50 ml (also available in 100 ml)' },
			{ label: 'Notes', value: 'Bergamot, jasmine, sandalwood' },
			{ label: 'Longevity', value: '8+ hours on skin' },
			{ label: 'Packaging', value: 'Glass bottle + gift box' }
		],
		option: { label: 'Size', choices: ['50 ml', '100 ml'] },
		seedReviews: [
			{
				name: 'Meera K.',
				rating: 5,
				helpful: 11,
				date: 'Nov 10, 2026',
				title: 'Smells far more expensive than it is',
				text: 'Warm, elegant and long-lasting — I get compliments every time I wear it. The bottle looks lovely on the shelf too.'
			},
			{
				name: 'Dev P.',
				rating: 5,
				helpful: 7,
				date: 'Oct 30, 2026',
				title: 'Bought it as a gift, kept one for myself',
				text: 'Beautiful packaging, perfect for gifting. The scent is fresh at first and settles into something warm.'
			}
		],
		qa: [
			{
				q: 'Is it suitable for daily wear?',
				a: 'Yes — it is light enough for daytime and lasts into the evening.'
			},
			{
				q: 'Is it unisex?',
				a: 'Yes, the bergamot-jasmine-sandalwood blend is designed to be worn by anyone.'
			}
		]
	},
	{
		id: 6,
		name: 'Classic Cotton T-Shirt',
		price: 19.99,
		oldPrice: 29.99,
		rating: 4.6,
		reviews: 87,
		category: 'Fashion',
		brand: 'ThreadCo',
		isNew: true,
		stock: 40,
		desc: 'A soft, breathable everyday t-shirt in premium combed cotton with a regular fit. Pre-shrunk, tag-free and made to keep its shape wash after wash.',
		src: '/product-tshirt.webp',
		images: ['/product-tshirt.webp', '/product-tshirt-2.webp'],
		highlights: [
			'100% combed cotton, 180 GSM — soft, not see-through',
			'Pre-shrunk and tag-free for all-day comfort',
			'Regular fit with reinforced collar',
			'Machine washable, keeps its shape'
		],
		specs: [
			{ label: 'Fabric', value: '100% combed cotton, 180 GSM' },
			{ label: 'Fit', value: 'Regular' },
			{ label: 'Care', value: 'Machine wash cold, tumble dry low' },
			{ label: 'Origin', value: 'Made in India' }
		],
		option: { label: 'Size', choices: ['S', 'M', 'L', 'XL'] },
		seedReviews: [
			{
				name: 'Imran S.',
				rating: 5,
				helpful: 10,
				date: 'Nov 6, 2026',
				title: 'My go-to basic tee',
				text: 'Thick enough to feel premium, soft from the first wash. Ordered three more in other colors.'
			},
			{
				name: 'Tara W.',
				rating: 4,
				helpful: 2,
				date: 'Oct 22, 2026',
				title: 'Good quality, size up if you like it loose',
				text: 'Fabric quality is great for the price. The fit is regular — size up for a relaxed look.'
			}
		],
		qa: [
			{
				q: 'Does it shrink after washing?',
				a: 'No, the fabric is pre-shrunk. Wash cold and avoid high-heat drying to keep the fit.'
			},
			{
				q: 'How is the fit?',
				a: 'Regular fit — true to size. Size up for a looser, relaxed fit.'
			}
		]
	},
	{
		id: 7,
		name: 'Ceramic Table Lamp',
		price: 34.99,
		oldPrice: 49.99,
		rating: 4.5,
		reviews: 52,
		category: 'Home & Kitchen',
		brand: 'Lumina',
		isNew: true,
		stock: 12,
		desc: 'A warm, modern table lamp with a hand-glazed ceramic base and a cream linen shade. Soft ambient light for bedrooms and living rooms.',
		src: '/product-lamp.webp',
		images: ['/product-lamp.webp', '/product-lamp-2.webp'],
		highlights: [
			'Hand-glazed ceramic base with linen shade',
			'Warm 2700K ambient light, E27 bulb included',
			'Inline switch with 3 brightness levels',
			'Perfect for bedside tables and reading corners'
		],
		specs: [
			{ label: 'Height', value: '42 cm (with shade)' },
			{ label: 'Base', value: 'Glazed ceramic' },
			{ label: 'Shade', value: 'Cream linen, 28 cm diameter' },
			{ label: 'Bulb', value: 'E27 LED included, 2700K warm' },
			{ label: 'Power', value: '220–240V, inline switch' }
		],
		option: { label: 'Color', choices: ['Beige', 'White'] },
		seedReviews: [
			{
				name: 'Nina F.',
				rating: 5,
				helpful: 13,
				date: 'Nov 3, 2026',
				title: 'Looks beautiful on my bedside table',
				text: 'Warm, soft light and the ceramic base feels really premium. The three brightness levels are handy at night.'
			},
			{
				name: 'Arjun B.',
				rating: 4,
				helpful: 5,
				date: 'Oct 15, 2026',
				title: 'Great lamp, shade could be sturdier',
				text: 'Lovely glow and solid base. The linen shade is a little delicate, so handle it gently when fitting the bulb.'
			}
		],
		qa: [
			{
				q: 'Is the bulb included?',
				a: 'Yes, an E27 warm-white LED bulb is included in the box.'
			},
			{
				q: 'Does it have a dimmer?',
				a: 'Yes, the inline switch cycles through three brightness levels.'
			}
		]
	}
];

export function getProduct(id: number): Product | undefined {
	return products.find((p) => p.id === id);
}

export function relatedProducts(id: number, count = 4): Product[] {
	const current = getProduct(id);
	const others = products.filter((p) => p.id !== id);
	const sameCat = others.filter((p) => current && p.category === current.category);
	return [...sameCat, ...others.filter((p) => !sameCat.includes(p))].slice(0, count);
}

export type Category = {
	name: string;
	photo: string;
};

export const categories: Category[] = [
	{ name: 'Electronics', photo: '/cat-electronics.webp' },
	{ name: 'Fashion', photo: '/cat-fashion.webp' },
	{ name: 'Home & Kitchen', photo: '/cat-home.webp' },
	{ name: 'Beauty', photo: '/cat-beauty.webp' },
	{ name: 'Sports', photo: '/cat-sports.webp' },
	{ name: 'Accessories', photo: '/cat-accessories.webp' }
];

export type Testimonial = {
	quote: string;
	name: string;
	photo: string;
};

export const testimonials: Testimonial[] = [
	{
		quote: 'Amazing products and fast delivery! ShopMate is my go-to store for all my needs.',
		name: 'John D.',
		photo: '/avatar-john.webp'
	},
	{
		quote: 'Great quality at affordable prices. The customer support is also very responsive.',
		name: 'Sarah M.',
		photo: '/avatar-sarah.webp'
	},
	{
		quote: 'Very happy with my purchase. Highly recommend ShopMate to everyone!',
		name: 'Michael T.',
		photo: '/avatar-michael.webp'
	}
];

/** Hero "trusted by" customer photos */
export const heroCustomers: string[] = [
	'/avatar-hero-1.webp',
	'/avatar-hero-2.webp',
	'/avatar-hero-3.webp',
	'/avatar-hero-4.webp'
];
