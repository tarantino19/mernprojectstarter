import React from 'react';

const MainBody = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 min-h-screen'>
			<main className='w-full px-4 sm:px-6 lg:px-8 py-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='bg-white bg-opacity-80 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-300 ease-in-out transform hover:scale-[1.02]'>
						{children}
					</div>
				</div>
			</main>
		</div>
	);
};

export default MainBody;
