import React from 'react';
import MainNav from '../components/MainNav';
import MainBody from '../components/MainBody';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type CartItemType = {
	id: number;
	title: string;
	price: number;
	quantity: number; // Add quantity to track the number of items
	image: string;
};

const fetchCartItems = async (): Promise<CartItemType[]> => {
	const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
	return cartItems;
};

const CartItems = () => {
	const queryClient = useQueryClient();
	const {
		data: cartItems = [],
		isLoading,
		isError,
	} = useQuery<CartItemType[]>({
		queryKey: ['cart'],
		queryFn: fetchCartItems,
	});

	if (isLoading) return <div>Loading cart items...</div>;
	if (isError) return <div>Error loading cart items</div>;

	// Calculate the total number of items and the total price
	const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
	const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

	const handleRemoveFromCart = (id: number) => {
		const updatedCart = cartItems.filter((item) => item.id !== id);
		localStorage.setItem('cart', JSON.stringify(updatedCart));
		queryClient.invalidateQueries(['cart']);
	};

	return (
		<div>
			<MainNav /> {/* Ensure MainNav is included for consistent styling */}
			<MainBody>
				<h1 className='text-2xl font-bold'>Your Cart</h1>

				{/* Display total items and total price */}
				{cartItems.length > 0 && (
					<div className='mb-4'>
						<p className='text-lg font-semibold'>Total Items: {totalItems}</p>
						<p className='text-lg font-semibold'>Total Price: ${totalPrice.toFixed(2)}</p>{' '}
						{/* Ensure proper display of total price */}
					</div>
				)}

				{cartItems.length === 0 ? (
					<div>Your cart is empty.</div>
				) : (
					<div className='grid grid-cols-1 gap-4'>
						{cartItems.map((item) => (
							<div key={item.id} className='border p-4 shadow rounded'>
								<img src={item.image} alt={item.title} className='w-24 h-24 object-cover' />
								<h2 className='text-lg font-bold'>{item.title}</h2>
								<p>
									${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
								</p>{' '}
								{/* Display price and quantity */}
								<button onClick={() => handleRemoveFromCart(item.id)} className='bg-red-500 text-white px-4 py-2 mt-2 rounded'>
									Remove from Cart
								</button>
							</div>
						))}
					</div>
				)}
			</MainBody>
		</div>
	);
};

export default CartItems;
