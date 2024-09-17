import React from 'react';
import { useParams } from 'react-router-dom';
import LogoutForm from './auth/LogOutForm';

const ProfilePage = () => {
	const params = useParams();
	const { profileId } = params;

	return (
		<div className='p-4'>
			<div>Single Profile Page - {profileId}</div>
			<LogoutForm />
		</div>
	);
};

export default ProfilePage;
