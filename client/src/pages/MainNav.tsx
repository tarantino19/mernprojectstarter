import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type User = {
	profileId: string;
	username: string;
};

const MainNav = () => {
	const navigate = useNavigate();

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

	return (
		<header className='bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-lg'>
			<div className='w-full px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex justify-between items-center w-full'>
					<nav>
						<ul className='flex space-x-4'>
							{['Home', 'About', 'Products'].map((item, index) => (
								<li key={item}>
									<Link
										to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
										className={`text-white font-bold text-lg px-4 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg ${
											['bg-pink-600', 'bg-purple-600', 'bg-indigo-600'][index]
										}`}
									>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					<div className='flex space-x-4'>
						<Link
							to='/profile'
							className='text-white font-bold text-lg px-4 py-2 bg-yellow-500 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-yellow-400'
						>
							Profile
						</Link>
						<button
							onClick={handleLogout}
							className='text-white font-bold text-lg px-4 py-2 bg-red-500 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg hover:bg-red-400 cursor-pointer'
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default MainNav;
