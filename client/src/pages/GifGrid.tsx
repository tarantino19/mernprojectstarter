import React from 'react';

// Component that displays 100 GIFs of Never Gonna Give You Up
const GifGrid = () => {
	// GIF URL
	const gifUrl =
		'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWVmaHdycGtvdGdiOG41eGZhOXpwYW9sNDh5emx3ZTlvMjQ3bjQzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a6OnFHzHgCU1O/giphy.gif';

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<div className='grid grid-cols-5 gap-4'>
				{Array.from({ length: 60 }).map((_, index) => (
					<img
						key={index}
						src={gifUrl}
						alt='Never Gonna Give You Up'
						style={{ width: '3in', height: '2in' }}
						className='rounded-lg shadow-lg'
					/>
				))}
			</div>
		</div>
	);
};

export default GifGrid;
