import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';
import MainNav from './MainNav';
import MainBody from './MainBody';

type UserProfile = {
	_id: string;
	username: string;
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
	} = useQuery({
		queryKey: ['userProfile'],
		queryFn: fetchUserProfile,
		staleTime: 24 * 60 * 60 * 1000,
	});

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <p>Error fetching user profile: {error instanceof Error ? error.message : 'Unknown error'}</p>;
	}

	return (
		<>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>Hello, {userProfile?.username}</h1>
				<div className='bg-white shadow rounded-lg p-6'>
					<p className='text-gray-700'>
						{' '}
						{userProfile ? (
							<div>
								<h2>{userProfile.username}</h2>
								<p>Profile ID: {userProfile._id}</p>
								{/* Add more profile details here */}
							</div>
						) : (
							<p>No user profile found.</p>
						)}
					</p>
				</div>
			</MainBody>
		</>
	);
};

export default ProfilePage;
