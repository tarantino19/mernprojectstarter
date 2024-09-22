import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import MainNav from '../components/MainNav';
import MainBody from '../components/MainBody';

type ProductData = {
	id: number;
	title: string;
	body: string;
};

const ProductDetails: React.FC = () => {
	const { productId } = useParams<{ productId: string }>();

	const fetchProductById = async (): Promise<ProductData> => {
		const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${productId}`);
		return response.data;
	};

	if (!productId) {
		return <div>Product ID not found.</div>;
	}

	const {
		data: product,
		isLoading,
		isError,
		error,
	} = useQuery<ProductData, Error>({
		queryKey: ['product', productId],
		queryFn: fetchProductById,
	});

	if (isLoading) return <Loader />;
	if (isError) return <div>Error fetching product: {error.message}</div>;

	return (
		<>
			<MainNav />
			<MainBody>
				<div className='border p-4 rounded'>
					<h1 className='text-2xl font-bold mb-4'>{product?.title}</h1>
					<p>{product?.body}</p>
				</div>
			</MainBody>
		</>
	);
};

export default ProductDetails;
