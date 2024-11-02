import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { increment, decrement, reset } from '../state/counterSlice';

const Counter: React.FC = () => {
	const count = useSelector((state: RootState) => state.counter.value);
	const dispatch = useDispatch();

	return (
		<div className='p-4 text-center'>
			<h1 className='text-3xl font-bold mb-4'>Counter</h1>
			<p className='text-2xl font-bold mb-4'>{count}</p>
			<button
				onClick={() => dispatch(increment())}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 mr-2'
			>
				+
			</button>
			<button
				onClick={() => dispatch(decrement())}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 ml-2'
			>
				-
			</button>
			<div className='h-4 mt-2'></div>
			<button
				onClick={() => dispatch(reset())}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 ml-2'
			>
				Reset
			</button>
		</div>
	);
};

export default Counter;
