import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainNav from './MainNav';
import MainBody from './MainBody';

type User = {
	profileId: string;
	username: string;
	// Add other user fields as needed
};

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();

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
	}, [navigate]);

	return (
		<>
			<MainNav />
			<MainBody>
				<h1>This is your main dashboard!!</h1>
				<div>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur quidem tempora molestias laudantium quod,
					facere quam explicabo at, fugiat ipsum architecto! Eos vero commodi modi minima, libero soluta porro vel?
				</div>
			</MainBody>
		</>
	);
};

export default Dashboard;
