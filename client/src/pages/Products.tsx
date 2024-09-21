import React from 'react';
import MainBody from '../components/MainBody';
import MainNav from '../components/MainNav';

const Products = () => {
	return (
		<div>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Products</h1>
			</MainBody>
		</div>
	);
};

export default Products;
