import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
	return (
		<div className='p-4'>
			<div className='text-xl'>Home Page</div>
			<Link to='/profiles'>Go to Profiles</Link>
		</div>
	);
};

export default HomePage;
