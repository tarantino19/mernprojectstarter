import React from 'react';

const MainBody = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='bg-white min-h-screen'>
			<main className='w-full px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mx-auto'>
					<div className='bg-white rounded-1xl shadow-2xl p-6 sm:p-6'>{children}</div>
				</div>
			</main>
		</div>
	);
};

export default MainBody;
