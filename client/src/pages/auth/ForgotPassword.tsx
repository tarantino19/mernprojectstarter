import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormData {
	email: string;
}

const ForgotPassword: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ForgotPasswordFormData>();
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	const onSubmit = async (data: ForgotPasswordFormData) => {
		if (loading) return;

		try {
			setLoading(true);
			setErrorMessage(null);
			setSuccessMessage(null);

			const response = await axios.post('http://localhost:4000/userApi/forgot-password', data);
			console.log('response', response);
			setSuccessMessage('Password reset link sent to your email');
			navigate('/change-password');
		} catch (error: any) {
			setErrorMessage('You need a valid email or the email must be verified first');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500'>
					Forgot Password
				</h1>

				{successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
				{errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='email'>
							Email Address
						</label>
						<input
							id='email'
							type='email'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^\S+@\S+\.\S+$/,
									message: 'Please enter a valid email address',
								},
							})}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-400 to-blue-500'
						/>
						{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
					</div>
					<button
						type='submit'
						className={`relative w-full py-3 text-white font-bold rounded-lg transition-all ${
							loading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
						}`}
						disabled={loading}
					>
						{loading && (
							<div className='absolute left-1/2 transform -translate-x-1/2'>
								<svg className='w-5 h-5 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' strokeWidth='4' stroke='currentColor' fill='none' />
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
								</svg>
							</div>
						)}
						{isSubmitting ? 'Submitting...' : 'Reset Password'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
