export type Product = {
	id: number;
	name: string;
	price: number;
	oldPrice: number;
	rating: number;
	reviews: number;
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
		src: '/product-smartwatch.webp'
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		price: 59.99,
		oldPrice: 89.99,
		rating: 4.7,
		reviews: 98,
		src: '/product-headphones.webp'
	},
	{
		id: 3,
		name: 'Travel Backpack',
		price: 39.99,
		oldPrice: 69.99,
		rating: 4.6,
		reviews: 156,
		src: '/product-backpack.webp'
	},
	{
		id: 4,
		name: 'Running Shoes',
		price: 49.99,
		oldPrice: 79.99,
		rating: 4.4,
		reviews: 78,
		src: '/product-shoes.webp'
	},
	{
		id: 5,
		name: 'Luxury Perfume',
		price: 29.99,
		oldPrice: 49.99,
		rating: 4.8,
		reviews: 64,
		src: '/product-perfume.webp'
	}
];

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
