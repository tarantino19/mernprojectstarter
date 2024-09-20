import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginFormData {
	username: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

	const onSubmit = async (data: LoginFormData) => {
		if (loading) return; // Prevent submission if already loading

		try {
			setLoading(true);
			setErrorMessage(null); // Reset any previous error message
			const response = await axios.post('http://localhost:4000/userApi/login', data, {
				withCredentials: true,
			});

			if (response.data.status === 'success') {
				navigate('/');
			} else {
				setErrorMessage('Username or password does not match existing account');
			}
		} catch (error) {
			console.error('Login error:', error);
			setErrorMessage('Username or password does not match existing account');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-2xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
					Welcome Back!
				</h1>
				{errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>} {/* Display error message */}
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='username'>
							Username
						</label>
						<input
							id='username'
							type='text'
							{...register('username', { required: 'Username is required' })}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='password'>
							Password
						</label>
						<input
							id='password'
							type='password'
							{...register('password', { required: 'Password is required' })}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
					</div>

					<button
						type='submit'
						className={`w-full py-2 text-white font-bold rounded-lg transition-all ${
							loading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700'
						}`}
						disabled={loading}
					>
						{loading ? 'Submitting...' : 'Log In'}
					</button>
				</form>
				<div className='text-center mt-4'>
					<Link
						to={'/forgot-password'}
						className='text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200'
					>
						Forgot Password?
					</Link>
				</div>
				<div className='text-center mt-4'>
					<Link to={'/signup'} className='text-sm font-semibold text-black'>
						Sign Up for a New Account Here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
