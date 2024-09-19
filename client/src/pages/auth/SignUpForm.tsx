import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export interface SignUpFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string;
	isAdmin?: boolean;
}

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<SignUpFormData>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const onSubmit = async (data: SignUpFormData) => {
		// Check if passwords match before proceeding with form submission
		if (data.password !== data.confirmPassword) {
			setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
			return;
		}

		try {
			setLoading(true);
			setErrorMessage(null); // Clear previous error message

			// Post signup data to the server
			const response = await axios.post(`http://localhost:4000/userApi/signup`, data);

			// Redirect to login page on success
			if (response.status === 200) {
				navigate('/email-confirmation-message');
			}
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.data) {
					// Check if the error message from backend indicates username already exists
					if (error.response.data.error === 'Username already exists') {
						setError('username', { type: 'manual', message: 'Username already exists. Please choose another one.' });
					} else {
						// Display other API error messages
						setErrorMessage(error.response.data.message || 'An error occurred during signup');
					}
				} else {
					// Fallback for unexpected errors
					setErrorMessage('Unexpected Error occurred. Please try again.');
				}
			} else {
				setErrorMessage('Unexpected Error occurred. Please try again.');
			}
		} finally {
			setLoading(false); // Stop the loading state
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-green-400'>
					Create Your Account!
				</h1>
				{errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='username'>
							Username
						</label>
						<input
							id='username'
							type='text'
							{...register('username', { required: 'Username is required' })}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='email'>
							Email
						</label>
						<input
							id='email'
							type='email'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^\S+@\S+$/i,
									message: 'Invalid email format',
								},
							})}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='password'>
							Password
						</label>
						<input
							id='password'
							type='password'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 6,
									message: 'Password must be at least 6 characters',
								},
							})}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='confirmPassword'>
							Confirm Password
						</label>
						<input
							id='confirmPassword'
							type='password'
							{...register('confirmPassword', {
								required: 'Please confirm your password',
							})}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
					</div>

					<button
						type='submit'
						disabled={loading} // Disable the button during submission
						className={`w-full py-3 ${
							loading
								? 'bg-gray-400'
								: 'bg-gradient-to-r from-red-400 via-yellow-500 to-green-400 hover:from-red-500 hover:via-yellow-600 hover:to-green-500'
						} text-white font-bold rounded-lg transition-all`}
					>
						{loading ? 'Submitting...' : 'Sign Up'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
