import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductProps {
	product: {
		id: number;
		title: string;
		body: string;
	};
}

const Product: React.FC<ProductProps> = ({ product }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/products/${product.id}`);
	};

	return (
		<div className='border-b border-gray-200 py-4 hover:cursor-pointer mt-1' onClick={handleClick}>
			<h2 className='text-xl font-semibold text-gray-800'>{product.title}</h2>
			<p className='text-gray-600'>{product.body}</p>
		</div>
	);
};

export default Product;
