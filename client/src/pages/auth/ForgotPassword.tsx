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
		formState: { errors },
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
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-green-500 to-blue-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-green-400'>
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
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
					</div>
					<button
						type='submit'
						className={`w-full py-3 text-white font-bold rounded-lg transition-all ${
							loading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-red-400 via-yellow-500 to-green-400 hover:from-red-500 hover:via-yellow-600 hover:to-green-500'
						}`}
						disabled={loading}
					>
						{loading ? 'Submitting...' : 'Reset Password'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
