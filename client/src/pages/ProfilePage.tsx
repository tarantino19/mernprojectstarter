import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../components/Loader';

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
		<div>
			<h1>Profile Page</h1>
			{userProfile ? (
				<div>
					<h2>{userProfile.username}</h2>
					<p>Profile ID: {userProfile._id}</p>
					{/* Add more profile details here */}
				</div>
			) : (
				<p>No user profile found.</p>
			)}
		</div>
	);
};

export default ProfilePage;
