import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const ProfilesPage = () => {
	return (
		<div className='p-4'>
			<div className='text-xl'>Profiles</div>
			<Outlet />
		</div>
	);
};

export default ProfilesPage;
