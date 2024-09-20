import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface ChangePasswordFormData {
	password: string;
	confirmPassword: string;
}

const ChangePassword: React.FC = () => {
	const { token } = useParams(); // Extract the token from the URL
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<ChangePasswordFormData>();
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	const onSubmit = async (data: ChangePasswordFormData) => {
		try {
			setLoading(true);
			setSuccessMessage(null);
			setErrorMessage(null);

			// Send the new password to the backend
			const response = await axios.post(`http://localhost:4000/userApi/reset-password/${token}`, {
				password: data.password,
			});

			if (response.status === 200) {
				setSuccessMessage('Password changed successfully!');
				setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
			}
		} catch (error) {
			console.error('Error:', error);
			setErrorMessage('Failed to reset password. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-2xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
					Change Your Password
				</h1>

				{successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
				{errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='password'>
							New Password
						</label>
						<input
							id='password'
							type='password'
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 8,
									message: 'Password must be at least 8 characters long',
								},
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-400 via-blue-500 to-purple-600'
						/>
						{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='confirmPassword'>
							Confirm New Password
						</label>
						<input
							id='confirmPassword'
							type='password'
							{...register('confirmPassword', {
								required: 'Confirm Password is required',
								validate: (value) => value === watch('password') || 'Passwords do not match',
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-green-400 via-blue-500 to-purple-600'
						/>
						{errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
					</div>

					<button
						type='submit'
						className={`w-full py-2 text-white font-bold rounded-lg transition-all ${
							loading
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
						}`}
						disabled={loading}
					>
						{loading ? 'Submitting...' : 'Change Password'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
