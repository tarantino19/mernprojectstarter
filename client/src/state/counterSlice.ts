import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

type CounterState = {
	value: number;
	amount: number | '';
};

const initialState: CounterState = {
	value: 0,
	amount: '', // Start with an empty string
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		reset: (state) => {
			state.value = 0;
		},
		incrementByAmount: (state) => {
			state.value += Number(state.amount) || 0;
		},
		setAmount: (state, action: PayloadAction<number | ''>) => {
			state.amount = action.payload;
		},
	},
});

export const incrementAsync = createAsyncThunk('counter/incrementAsync', async (amount: number) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return amount;
});

export const { increment, decrement, reset, incrementByAmount, setAmount } = counterSlice.actions;
export default counterSlice.reducer;
