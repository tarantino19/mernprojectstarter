import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ChangePasswordFormData {
	email: string;
	otp: string;
	newPassword: string;
	confirmNewPassword: string;
}

const ChangePassword: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ChangePasswordFormData>();
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);
	const [otpError, setOtpError] = useState<string | null>(null);
	const navigate = useNavigate();

	const onSubmit = async (data: ChangePasswordFormData) => {
		if (loading) return;

		try {
			setLoading(true);
			setErrorMessage(null);
			setEmailError(null);
			setOtpError(null);
			setSuccessMessage(null);

			await axios.post('http://localhost:4000/userApi/change-password', data);
			setSuccessMessage('Password changed successfully.');

			setTimeout(() => {
				navigate('/login');
			}, 500);
		} catch (error: any) {
			// Handle different error responses
			if (error.response && error.response.data) {
				const backendError = error.response.data.error;
				if (backendError === 'Invalid email') {
					setEmailError('The email is invalid or does not exist.');
				} else if (backendError === 'Invalid OTP') {
					setOtpError('The OTP is incorrect.');
				} else {
					setErrorMessage('Failed to change password.');
				}
			} else {
				setErrorMessage('An unexpected error occurred.');
			}
		} finally {
			setLoading(false);
		}
	};

	const validatePasswordMatch = (value: string) => {
		return value === watch('newPassword') || 'Passwords do not match';
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<div className='text-center'>Check your email for the OTP.</div>
				<div className='text-center mb-4'>Hurry! it expires within 30 minutes!</div>
				<h1 className='text-2xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
					Change Your Password Below
				</h1>
				{successMessage && <p className='text-green-500 text-center mb-4'>{successMessage}</p>}
				{errorMessage && <p className='text-red-500 text-center mb-4'>{errorMessage}</p>}
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: 'Invalid email address',
								},
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
						{emailError && <p className='text-red-500 text-sm'>{emailError}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='otp'>
							OTP
						</label>
						<input
							id='otp'
							type='text'
							{...register('otp', {
								required: 'OTP is required',
								pattern: { value: /^\d{4}$/, message: 'OTP must be exactly 4 digits' },
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
							maxLength={4}
						/>
						{errors.otp && <p className='text-red-500 text-sm'>{errors.otp.message}</p>}
						{otpError && <p className='text-red-500 text-sm'>{otpError}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='newPassword'>
							New Password
						</label>
						<input
							id='newPassword'
							type='password'
							{...register('newPassword', {
								required: 'New password is required',
								minLength: { value: 6, message: 'Password must be at least 6 characters' },
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.newPassword && <p className='text-red-500 text-sm'>{errors.newPassword.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='confirmNewPassword'>
							Confirm New Password
						</label>
						<input
							id='confirmNewPassword'
							type='password'
							{...register('confirmNewPassword', {
								required: 'Please confirm your password',
								validate: validatePasswordMatch,
							})}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.confirmNewPassword && <p className='text-red-500 text-sm'>{errors.confirmNewPassword.message}</p>}
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
						{loading ? 'Creating New Password...' : 'Change Password'}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChangePassword;
