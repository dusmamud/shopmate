export type Product = {
	id: number;
	name: string;
	price: number;
	oldPrice: number;
	rating: number;
	reviews: number;
	category: string;
	stock: number;
	desc: string;
	/** AI-generated product photo in /static */
	src: string;
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
		stock: 14,
		desc: 'Stay connected on the go with a bright AMOLED display, heart-rate and sleep tracking, 7-day battery life and 50m water resistance.',
		src: '/product-smartwatch.webp'
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		price: 59.99,
		oldPrice: 89.99,
		rating: 4.7,
		reviews: 98,
		category: 'Electronics',
		stock: 22,
		desc: 'Immersive sound with active noise cancellation, 40-hour battery life, plush memory-foam earcups and Bluetooth 5.3 multipoint pairing.',
		src: '/product-headphones.webp'
	},
	{
		id: 3,
		name: 'Travel Backpack',
		price: 39.99,
		oldPrice: 69.99,
		rating: 4.6,
		reviews: 156,
		category: 'Accessories',
		stock: 30,
		desc: 'A rugged 22L everyday carry backpack in water-resistant olive canvas, with a padded 15.6" laptop sleeve and anti-theft pocket.',
		src: '/product-backpack.webp'
	},
	{
		id: 4,
		name: 'Running Shoes',
		price: 49.99,
		oldPrice: 79.99,
		rating: 4.4,
		reviews: 78,
		category: 'Sports',
		stock: 18,
		desc: 'Featherlight mesh running shoes with responsive foam cushioning, breathable knit upper and grippy outsole for road and trail.',
		src: '/product-shoes.webp'
	},
	{
		id: 5,
		name: 'Luxury Perfume',
		price: 29.99,
		oldPrice: 49.99,
		rating: 4.8,
		reviews: 64,
		category: 'Beauty',
		stock: 25,
		desc: 'An elegant eau de parfum with notes of bergamot, jasmine and warm sandalwood. Long-lasting, 50ml glass bottle with a silver cap.',
		src: '/product-perfume.webp'
	},
	{
		id: 6,
		name: 'Classic Cotton T-Shirt',
		price: 19.99,
		oldPrice: 29.99,
		rating: 4.6,
		reviews: 87,
		category: 'Fashion',
		stock: 40,
		desc: 'A soft, breathable everyday t-shirt in premium combed cotton with a regular fit. Pre-shrunk, tag-free and made to keep its shape wash after wash.',
		src: '/product-tshirt.webp'
	},
	{
		id: 7,
		name: 'Ceramic Table Lamp',
		price: 34.99,
		oldPrice: 49.99,
		rating: 4.5,
		reviews: 52,
		category: 'Home & Kitchen',
		stock: 12,
		desc: 'A warm, modern table lamp with a hand-glazed ceramic base and a cream linen shade. Soft ambient light for bedrooms and living rooms.',
		src: '/product-lamp.webp'
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
