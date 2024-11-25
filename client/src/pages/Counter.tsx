import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { increment, decrement, reset, incrementByAmount, setAmount } from '../state/counterSlice';

const Counter: React.FC = () => {
	const count = useSelector((state: RootState) => state.counter.value);
	const amount = useSelector((state: RootState) => state.counter.amount);
	const dispatch = useDispatch();

	const actions = {
		increment: () => dispatch(increment()),
		decrement: () => dispatch(decrement()),
		reset: () => dispatch(reset()),
		incrementByAmount: () => {
			dispatch(incrementByAmount());
			dispatch(setAmount('')); // Reset input field
		},
		setAmount: (value: number | '') => dispatch(setAmount(value)),
	};

	return (
		<div className='p-4 text-center'>
			<h1 className='text-3xl font-bold mb-4'>Counter</h1>
			<p className='text-2xl font-bold mb-4'>{count}</p>

			{/* Increment and Decrement Buttons */}
			<button
				onClick={actions.increment}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 mr-2'
			>
				+
			</button>
			<button
				onClick={actions.decrement}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 ml-2'
			>
				-
			</button>

			{/* Reset Button */}
			<div className='h-4 mt-2'></div>
			<button
				onClick={actions.reset}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105 ml-2'
			>
				Reset
			</button>

			{/* Input for Increment Amount */}
			<div className='mt-4'>
				<input
					type='number'
					value={amount}
					onChange={(e) => {
						const value = e.target.value === '' ? '' : Number(e.target.value);
						actions.setAmount(value);
					}}
					style={{ width: '30%' }} // 70% smaller than full width
					className='p-2 border border-gray-300 rounded mb-2'
					placeholder='Enter amount'
				/>
				<button
					onClick={actions.incrementByAmount}
					className='ml-4 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105'
				>
					Increment by {amount || '...'}
				</button>
			</div>
		</div>
	);
};

export default Counter;
