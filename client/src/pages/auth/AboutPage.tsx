import React from 'react';
import MainNav from '../MainNav';
import MainBody from '../MainBody';

const AboutPage = () => {
	return (
		<div>
			<MainNav />
			<MainBody>
				<h1 className='text-3xl font-bold text-gray-900 mb-4'>About Page</h1>
			</MainBody>
		</div>
	);
};

export default AboutPage;