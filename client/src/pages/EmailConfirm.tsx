import React from 'react';
import { Link } from 'react-router-dom';

const EmailConfirm: React.FC = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
				<h1 className='text-3xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500'>
					Confirm Your Email
				</h1>
				<p className='text-gray-700 text-center mb-6'>
					Thank you for signing up! We’ve sent a confirmation link to your email. Please check your inbox and click the link
					to verify your email address.
				</p>

				<div className='flex justify-center'>
					<Link
						to='/'
						className='px-6 py-2 text-white font-bold bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
					>
						Go Back to the Home Page
					</Link>
				</div>
			</div>
		</div>
	);
};

export default EmailConfirm;
