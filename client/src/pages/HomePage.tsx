import React from 'react';
import { Link } from 'react-router-dom';
import LogoutForm from './auth/LogOutForm';

const HomePage = () => {
	return (
		<div className='p-4'>
			<div className='text-xl'>Home Page</div>
			<Link to='/profiles'>Go to Profiles</Link>
			<br />
			<br />
			<LogoutForm />
		</div>
	);
};

export default HomePage;
