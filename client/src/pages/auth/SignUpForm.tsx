import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
		if (data.password !== data.confirmPassword) {
			setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
			return;
		}

		try {
			setLoading(true);
			setErrorMessage(null);

			const response = await axios.post(`http://localhost:4000/userApi/signup`, data);
			if (response.status === 201) {
				navigate('/email-confirmation');
			}
		} catch (error: any) {
			if (axios.isAxiosError(error) && error.response && error.response.data) {
				if (error.response.data.error === 'Username already exists') {
					setError('username', { type: 'manual', message: 'Username already exists. Please choose another one.' });
				}
				if (error.response.data.error === 'Email already registered') {
					setError('email', { type: 'manual', message: 'Email already exists. Please choose another one.' });
				} else {
					setErrorMessage(error.response.data.message || 'An error occurred during signup');
				}
			} else {
				setErrorMessage('Unexpected Error occurred. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500'>
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
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
						{errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
					</div>

					<button
						type='submit'
						disabled={loading}
						className={`w-full py-3 ${
							loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
						} text-white font-bold rounded-lg transition-all`}
					>
						{loading ? 'Submitting...' : 'Sign Up'}
					</button>
				</form>
				<div className='pt-10 text-center'>
					<div className='text-sm'>Already have an account? </div>
					<Link to={'/login'} className='text-md font-semibold text-black'>
						Log in here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpForm;
