import React, { useState } from 'react';
import MainBody from '../components/MainBody';
import MainNav from '../components/MainNav';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';

type ProductType = {
	id: number;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
	rating: {
		rate: number;
		count: number;
	};
};

type CartItemType = {
	product: ProductType; // Store the whole product
	quantity: number; // Store the quantity
};

const fetchProducts = async (): Promise<ProductType[]> => {
	const response = await axios.get('https://fakestoreapi.com/products');
	return response.data;
};

const Store = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});
	const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
	const queryClient = useQueryClient();

	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery<ProductType[], Error>({
		queryKey: ['products'],
		queryFn: fetchProducts,
	});

	const addToCartMutation = useMutation({
		mutationFn: (newItem: CartItemType) => {
			// Add the product with the selected quantity to cart stored in local storage
			const existingCart: CartItemType[] = JSON.parse(localStorage.getItem('cart') || '[]');
			const updatedCart = [...existingCart, newItem];
			localStorage.setItem('cart', JSON.stringify(updatedCart));
			return updatedCart;
		},
		onSuccess: (data, variables) => {
			// Mark the product as added to the cart for feedback
			setAddedToCart((prev) => ({ ...prev, [variables.product.id]: true }));
			queryClient.invalidateQueries(['cart']); // Refresh cart state after adding

			// Revert button state after 2 seconds
			setTimeout(() => {
				setAddedToCart((prev) => ({ ...prev, [variables.product.id]: false }));
			}, 2000);
		},
	});

	// Get unique categories for filtering
	const categories: string[] = [];
	products?.forEach((product) => {
		if (!categories.includes(product.category)) {
			categories.push(product.category);
		}
	});

	const filteredProducts = products?.filter(
		(product) =>
			(product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(selectedCategory === '' || product.category === selectedCategory)
	);

	const handleAddToCart = (product: ProductType) => {
		// Check if product is valid before proceeding
		if (!product || !product.id) {
			console.error('Product is undefined or missing an id:', product);
			return;
		}

		const existingCart: CartItemType[] = JSON.parse(localStorage.getItem('cart') || '[]');

		// Check if the product is already in the cart
		const existingProductIndex = existingCart.findIndex((item) => item.product.id === product.id);

		if (existingProductIndex > -1) {
			// If the product already exists in the cart, update its quantity
			existingCart[existingProductIndex].quantity += quantities[product.id] || 1; // Default to 1 if no quantity is specified
		} else {
			// Otherwise, add the new product with the selected quantity
			existingCart.push({
				product, // Add the product itself
				quantity: quantities[product.id] || 1, // Default to 1 if no quantity is specified
			});
		}

		// Save updated cart in local storage
		localStorage.setItem('cart', JSON.stringify(existingCart));

		// Invalidate the cart query to trigger a re-fetch in React Query
		addToCartMutation.mutate(existingCart);
	};

	const handleQuantityChange = (productId: number, newQuantity: number) => {
		setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
	};

	if (isLoading) return <Loader />;
	if (isError) return <div>Error fetching products: {error.message}</div>;

	return (
		<div>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Products</h1>

				{/* Search Bar */}
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

				{/* Dropdown for filtering by category */}
				<div className='my-4'>
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded'
					>
						<option value=''>All Categories</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</option>
						))}
					</select>
				</div>

				{/* Display filtered products */}
				{filteredProducts && filteredProducts.length === 0 ? (
					<div className='text-center font-bold text-gray-500'>Sorry, no products found for the current search.</div>
				) : (
					<div className='bg-white shadow rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{filteredProducts?.map((product) => (
							<div key={product.id} className='border p-4 shadow rounded'>
								<img src={product.image} alt={product.title} className='w-full h-40 object-cover' />
								<h2 className='text-lg font-bold mt-2'>{product.title}</h2>
								<p>{product.description}</p>
								<p className='font-semibold'>${product.price}</p>

								{/* Quantity Selector */}
								<div className='mt-2'>
									<label htmlFor={`quantity-${product.id}`} className='block text-sm font-medium'>
										Quantity:
									</label>
									<input
										type='number'
										id={`quantity-${product.id}`}
										value={quantities[product.id] || 1}
										min={1}
										onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
										className='w-full p-2 border border-gray-300 rounded mt-1'
									/>
								</div>

								{/* Add to Cart Button with feedback */}
								<button
									onClick={() => handleAddToCart(product)}
									disabled={addedToCart[product.id]} // Disable button if item is added
									className={`px-4 py-2 mt-4 rounded transition-all ${
										addedToCart[product.id]
											? 'bg-green-500 text-white cursor-not-allowed'
											: 'bg-blue-500 text-white hover:bg-blue-600'
									}`}
								>
									{addedToCart[product.id] ? 'Added to Cart!' : 'Add to Cart'}
								</button>
							</div>
						))}
					</div>
				)}
			</MainBody>
		</div>
	);
};

export default Store;
