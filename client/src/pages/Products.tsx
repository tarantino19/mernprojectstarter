import React from 'react';
import MainBody from '../components/MainBody';
import MainNav from '../components/MainNav';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import Product from './Product';

type Products = {
	id: number;
	title: string;
	body: string;
};

const fetchProducts = async (): Promise<Products[]> => {
	const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
	return response.data;
};

const Products = () => {
	const {
		data: products,
		isLoading,
		isError,
		error,
	} = useQuery<Products[], Error>({
		queryKey: ['products'],
		queryFn: fetchProducts,
	});

	if (isLoading) return <Loader />;
	if (isError) return <div>Error fetching products: {error.message}</div>;

	return (
		<div>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Products</h1>
				<div className='bg-white shadow rounded-lg p-6'>
					{products?.map((product) => (
						<Product key={product.id} product={product} />
					))}
				</div>
			</MainBody>
		</div>
	);
};

export default Products;
