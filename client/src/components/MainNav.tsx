import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchCartItems = async () => {
	const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
	return cartItems;
};

const MainNav = () => {
	const navigate = useNavigate();

	const { data: cartItems = [] } = useQuery({
		queryKey: ['cart'],
		queryFn: fetchCartItems, // Object form for useQuery in v5
	});

	const clearAuthToken = () => {
		document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
	};

	const handleLogout = async () => {
		try {
			await axios.post(
				'http://localhost:4000/userApi/logout',
				{},
				{
					withCredentials: true,
				}
			);
			clearAuthToken();
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	// Calculate total number of items in the cart
	const totalItemsInCart = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

	return (
		<header className='bg-gradient-to-r from-green-400 to-blue-500 shadow-md'>
			<div className='w-full px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex justify-between items-center w-full'>
					<nav>
						<ul className='flex space-x-4'>
							<li>
								<Link
									to='/'
									className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:scale-105'
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									to='/about-page'
									className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:scale-105'
								>
									About
								</Link>
							</li>
							<li>
								<Link
									to='/products'
									className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:scale-105'
								>
									Products
								</Link>
							</li>
							<li>
								<Link
									to='/store'
									className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-70 hover:scale-105'
								>
									Fake Store
								</Link>
							</li>
						</ul>
					</nav>
					<div className='flex space-x-4'>
						<Link
							to='/cart-items'
							className='text-white font-bold text-lg px-4 py-2 border border-white rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-50 hover:scale-105'
						>
							Cart Items
							{/* Display total items count in red */}
							{totalItemsInCart > 0 && <span className='ml-2 text-red-500 font-bold'>({totalItemsInCart})</span>}
						</Link>
						<Link
							to='/profile'
							className='text-white font-bold text-lg px-4 py-2 border border-white rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-50 hover:scale-105'
						>
							Profile
						</Link>
						<button
							onClick={handleLogout}
							className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer'
						>
							Logout
						</button>
					</div>
				</div>
			</div>
			<div className='h-1 bg-green-100' /> {/* Decorative line */}
		</header>
	);
};

export default MainNav;
