import { createSlice } from '@reduxjs/toolkit';

type counterState = {
	value: number;
};

const initialState: counterState = {
	value: 0,
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => {
			``;
			state.value += 1;
			console.log('counterState', state.value);
		},
		decrement: (state) => {
			state.value -= 1;
			console.log('counterState', state.value);
		},
		reset: (state) => {
			state.value = 0;
			console.log('counterState', state.value);
		},
	},
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
