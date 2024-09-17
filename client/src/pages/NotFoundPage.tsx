import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<div className='p-4'>
			Page Does Not Exist:{' '}
			<Link className='text-blue-500' to='/'>
				Go Back to Home Page
			</Link>
		</div>
	);
};

export default NotFoundPage;
