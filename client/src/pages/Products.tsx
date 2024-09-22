import React, { useState } from 'react';
import MainBody from '../components/MainBody';
import MainNav from '../components/MainNav';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import Product from './Product';
import SearchBar from '../components/SearchBar'; // Import SearchBar component

type Products = {
	id: number;
	title: string;
	body: string;
	userId: number; // Ensure userId is required
};

const fetchProducts = async (): Promise<Products[]> => {
	const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
	return response.data;
};

const Products = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedUserId, setSelectedUserId] = useState(''); // State for the dropdown selected userId

	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery<Products[], Error>({
		queryKey: ['products'],
		queryFn: fetchProducts,
	});

	// Get unique userIds by looping through the products
	const userIds: number[] = [];
	products?.forEach((product) => {
		if (!userIds.includes(product.userId)) {
			userIds.push(product.userId);
		}
	});

	// Filtering products by title/body and selected userId
	const filteredProducts = products?.filter(
		(product) =>
			(product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.body.toLowerCase().includes(searchTerm.toLowerCase())) &&
			(selectedUserId === '' || product.userId === Number(selectedUserId))
	);

	if (isLoading) return <Loader />;
	if (isError) return <div>Error fetching products: {error.message}</div>;

	return (
		<div>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Products</h1>

				{/* Search by Title/Body */}
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

				{/* Dropdown for filtering by userId */}
				<div className='my-4'>
					<select
						value={selectedUserId}
						onChange={(e) => setSelectedUserId(e.target.value)}
						className='w-full p-2 border border-gray-300 rounded'
					>
						<option value=''>All Products</option>
						{userIds.map((userId) => (
							<option key={userId} value={userId}>
								User {userId}
							</option>
						))}
					</select>
				</div>

				{/* Display filtered products */}
				{filteredProducts && filteredProducts.length === 0 ? (
					<div className='text-center font-bold text-gray-500'>Sorry, no products found for the current search.</div>
				) : (
					<div className='bg-white shadow rounded-lg p-6'>
						{filteredProducts?.map((product) => (
							<Product key={product.id} product={product} />
						))}
					</div>
				)}
			</MainBody>
		</div>
	);
};

export default Products;
