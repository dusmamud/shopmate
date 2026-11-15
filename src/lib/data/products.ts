export type Product = {
	id: number;
	name: string;
	price: number;
	oldPrice: number;
	rating: number;
	reviews: number;
	/** 'photo' uses a generated WebP in /static, 'art' uses a hand-drawn SVG */
	kind: 'photo' | 'art';
	src: string;
	badge?: string;
};

export const products: Product[] = [
	{
		id: 1,
		name: 'Smart Watch Series 5',
		price: 89.99,
		oldPrice: 129.99,
		rating: 4.5,
		reviews: 128,
		kind: 'art',
		src: 'smartwatch',
		badge: '-31%'
	},
	{
		id: 2,
		name: 'Wireless Headphones',
		price: 59.99,
		oldPrice: 89.99,
		rating: 4.7,
		reviews: 98,
		kind: 'photo',
		src: '/product-headphones.webp',
		badge: '-33%'
	},
	{
		id: 3,
		name: 'Travel Backpack',
		price: 39.99,
		oldPrice: 69.99,
		rating: 4.6,
		reviews: 156,
		kind: 'photo',
		src: '/product-backpack.webp',
		badge: '-43%'
	},
	{
		id: 4,
		name: 'Running Shoes',
		price: 49.99,
		oldPrice: 79.99,
		rating: 4.4,
		reviews: 78,
		kind: 'art',
		src: 'shoes',
		badge: '-38%'
	},
	{
		id: 5,
		name: 'Luxury Perfume',
		price: 29.99,
		oldPrice: 49.99,
		rating: 4.8,
		reviews: 64,
		kind: 'art',
		src: 'bottle',
		badge: '-40%'
	}
];

export type Category = {
	name: string;
	art: string;
	bg: string;
};

export const categories: Category[] = [
	{ name: 'Electronics', art: 'headphones', bg: '#e8eef7' },
	{ name: 'Fashion', art: 'shirt', bg: '#fbe4e4' },
	{ name: 'Home & Kitchen', art: 'sofa', bg: '#fdf3d7' },
	{ name: 'Beauty', art: 'perfume', bg: '#efe6f7' },
	{ name: 'Sports', art: 'sneaker', bg: '#e2f2e8' },
	{ name: 'Accessories', art: 'watch', bg: '#fdeede' }
];

export type Testimonial = {
	quote: string;
	name: string;
	initials: string;
	color: string;
};

export const testimonials: Testimonial[] = [
	{
		quote: 'Amazing products and fast delivery! ShopMate is my go-to store for all my needs.',
		name: 'John D.',
		initials: 'JD',
		color: '#5c7038'
	},
	{
		quote: 'Great quality at affordable prices. The customer support is also very responsive.',
		name: 'Sarah M.',
		initials: 'SM',
		color: '#c9a86a'
	},
	{
		quote: 'Very happy with my purchase. Highly recommend ShopMate to everyone!',
		name: 'Michael T.',
		initials: 'MT',
		color: '#7d9b52'
	}
];
