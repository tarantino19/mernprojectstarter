import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import MainNav from '../components/MainNav';
import MainBody from '../components/MainBody';
import { Link } from 'react-router-dom';

type UserProfile = {
	_id: string;
	username: string;
	isAdmin: boolean;
	// Add other fields as needed
};

// Fetch function for the user profile
const fetchUserProfile = async (): Promise<UserProfile> => {
	try {
		const response = await axios.get('http://localhost:4000/userApi/user/profile', {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.log('Error fetching user profile:', error);
		return Promise.reject(error);
	}
};

const ProfilePage = () => {
	const {
		data: userProfile,
		isLoading,
		isError,
		error,
		status,
	} = useQuery({
		queryKey: ['userProfile'],
		queryFn: fetchUserProfile,
	});

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>Error fetching user profile: {error instanceof Error ? error.message : 'Unknown error'}</div>;
	}

	if (status === 'success') {
		return (
			<>
				<MainNav />
				<MainBody>
					<h1 className='text-3xl font-bold text-gray-900 mb-4'>Hello, {userProfile?.username}</h1>
					<div className='bg-white shadow rounded-lg p-6'>
						<div className='text-gray-700'>
							{' '}
							{userProfile ? (
								<div>
									<h2>{userProfile.username}</h2>
									<div>Profile ID: {userProfile._id}</div>
									<div>is an Admin? {userProfile.isAdmin ? 'Yes' : 'No'}</div>
								</div>
							) : (
								<div>No user profile found.</div>
							)}
						</div>
						<div className='text-gray-700'>
							<Link to={'/forgot-password'}>Want to Change Password? Request Your OTP Here</Link>
						</div>
					</div>
					<div className='p-4'>
						{userProfile?.isAdmin ? (
							<div className='bg-gray-100 p-4 rounded-lg shadow-md'>
								<p className='font-bold mb-2 text-gray-800'>
									You are an admin! That means you can see this thing I conditionally rendered here...
								</p>
								<Link
									to='/rick'
									className='inline-block px-6 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all'
								>
									Get Your Admin Goodies Here...
								</Link>
							</div>
						) : (
							<div className='bg-gray-100 p-4 rounded-lg shadow-md'>
								<p className='font-bold mb-2 text-gray-800'>You are an not an admin but I still love you for being a member.</p>
								<Link
									to='/rick'
									className='inline-block px-6 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:via-blue-600 hover:to-purple-700 transition-all'
								>
									Get Your Admin Goodies Here...
								</Link>
							</div>
						)}
					</div>
				</MainBody>
			</>
		);
	}
};

export default ProfilePage;
