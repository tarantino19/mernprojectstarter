import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type User = {
	profileId: string;
	username: string;
	// Add other user fields as needed
};

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
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

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('http://localhost:4000/userApi/user/profile', {
					withCredentials: true,
				});

				console.log('User1:', response.data);
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
				// Redirect to login if not authenticated
				navigate('/login');
			}
		};

		fetchUserData();
	}, []);

	return (
		<div className='min-h-screen bg-gray-100'>
			<header className='bg-white shadow'>
				<div className='w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
					<nav>
						<ul className='flex space-x-4'>
							<li>
								<a href='#' className='text-green-600 hover:text-green-800 font-medium text-lg'>
									Home
								</a>
							</li>
							<li>
								<a href='#' className='text-green-600 hover:text-green-800 font-medium text-lg'>
									About
								</a>
							</li>
							<li>
								<a href='#' className='text-green-600 hover:text-green-800 font-medium text-lg'>
									Products
								</a>
							</li>
						</ul>
					</nav>
					<div className='flex space-x-2'>
						<div>
							<Link to={`/profile`} className='text-green-600 hover:text-green-800 font-medium text-lg'>
								Profile
							</Link>
						</div>
						<div>
							<a onClick={handleLogout} className='text-green-600 hover:text-green-800 font-medium text-lg cursor-pointer'>
								Logout
							</a>
						</div>
					</div>
				</div>
			</header>
			<main className='w-full px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Welcome to Your Dashboard</h1>
				<div className='bg-white shadow rounded-lg p-6'>
					<p className='text-gray-700'>This is your homepage dashboard. You can add more content here.</p>
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
