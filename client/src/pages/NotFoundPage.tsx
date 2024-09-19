import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-center p-4'>
			{/* Unicorn Container */}
			<div className='relative w-96 h-96 flex items-center justify-center mb-8'>
				{/* Unicorn Body */}
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-white rounded-3xl shadow-xl'>
					{/* Unicorn Head */}
					<div className='absolute -top-24 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-white rounded-t-full'>
						{/* Unicorn Horn */}
						<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-6 h-24 bg-gradient-to-t from-yellow-300 to-pink-300 rounded-t-full transform rotate-6'></div>

						{/* Unicorn Eyes */}
						<div className='absolute top-16 left-4 w-6 h-6 bg-black rounded-full'></div>
						<div className='absolute top-16 right-4 w-6 h-6 bg-black rounded-full'></div>

						{/* Unicorn Nose */}
						<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-pink-200 rounded-full'></div>
					</div>

					{/* Unicorn Ears */}
					<div className='absolute -top-8 left-8 w-16 h-16 bg-white rounded-t-full transform -rotate-30'></div>
					<div className='absolute -top-8 right-8 w-16 h-16 bg-white rounded-t-full transform rotate-30'></div>

					{/* Unicorn Mane */}
					<div className='absolute -top-4 left-0 right-0 h-16 overflow-hidden'>
						<div className='w-full h-full flex'>
							{[...Array(8)].map((_, i) => (
								<div
									key={i}
									className={`w-1/8 h-full bg-gradient-to-b ${
										[
											'from-red-500 to-pink-500',
											'from-orange-500 to-yellow-500',
											'from-yellow-500 to-green-500',
											'from-green-500 to-teal-500',
											'from-teal-500 to-blue-500',
											'from-blue-500 to-indigo-500',
											'from-indigo-500 to-purple-500',
											'from-purple-500 to-pink-500',
										][i]
									} rounded-b-full transform translate-y-1/2`}
								></div>
							))}
						</div>
					</div>

					{/* Unicorn Legs */}
					<div className='absolute bottom-0 left-6 w-8 h-16 bg-white rounded-b-lg'></div>
					<div className='absolute bottom-0 left-20 w-8 h-16 bg-white rounded-b-lg'></div>
					<div className='absolute bottom-0 right-6 w-8 h-16 bg-white rounded-b-lg'></div>
					<div className='absolute bottom-0 right-20 w-8 h-16 bg-white rounded-b-lg'></div>

					{/* Unicorn Tail */}
					<div className='absolute -right-16 top-1/2 transform -translate-y-1/2 w-24 h-32 overflow-hidden'>
						<div className='w-full h-full flex flex-col'>
							{[...Array(6)].map((_, i) => (
								<div
									key={i}
									className={`w-full h-1/6 bg-gradient-to-r ${
										[
											'from-red-500 to-pink-500',
											'from-orange-500 to-yellow-500',
											'from-yellow-500 to-green-500',
											'from-green-500 to-blue-500',
											'from-blue-500 to-indigo-500',
											'from-indigo-500 to-purple-500',
										][i]
									} rounded-r-full transform translate-x-1/2`}
								></div>
							))}
						</div>
					</div>
				</div>
			</div>
			<h1 className='text-6xl font-extrabold text-white mb-4 animate-bounce'>Whoops!</h1>
			<p className='text-2xl text-white mb-6'>This page galloped away with a unicorn!</p>
			<Link
				to='/'
				className='text-2xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 py-3 px-8 rounded-full shadow-lg hover:bg-gradient-to-l hover:from-purple-500 hover:to-pink-500 transition duration-300 animate-pulse'
			>
				Ride Back to Home
			</Link>
		</div>
	);
};

export default NotFoundPage;
