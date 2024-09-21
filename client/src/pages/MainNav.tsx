import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainNav = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const clearAuthToken = () => {
		document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
	};

	const handleLogout = async () => {
		try {
			setIsLoading(true);
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
		} finally {
			setIsLoading(false);
		}
	};

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
						</ul>
					</nav>
					<div className='flex space-x-4'>
						<Link
							to='/profile'
							className='text-white font-bold text-lg px-4 py-2 border border-white rounded-full transition-all duration-300 ease-in-out hover:bg-opacity-50 hover:scale-105'
						>
							Profile
						</Link>
						<button
							onClick={handleLogout}
							className='text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer'
							disabled={isLoading}
						>
							{isLoading ? 'Logging out...' : 'Logout'}
						</button>
					</div>
				</div>
			</div>
			<div className='h-1 bg-green-100' /> {/* Decorative line */}
		</header>
	);
};

export default MainNav;
