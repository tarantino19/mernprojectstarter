import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailConfirm: React.FC = () => {
	const [otp, setOtp] = useState('');
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (otp.length !== 4) {
			setErrorMessage('Please enter a valid 4-digit OTP.');
			return;
		}
		if (!email) {
			setErrorMessage('Email is required.');
			return;
		}

		try {
			setLoading(true); // Start loading
			const response = await axios.post('http://localhost:4000/userApi/verify-otp', { email, otp });
			setSuccessMessage(response.data.message);
			setErrorMessage('');

			// Wait a bit before redirecting
			setTimeout(() => {
				navigate('/login');
			}, 1000);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				setErrorMessage(error.response.data.error || 'An error occurred. Please try again.');
			} else {
				setErrorMessage('An unexpected error occurred.');
			}
			setSuccessMessage('');
		} finally {
			setLoading(false); // Stop loading
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
				<h1 className='text-3xl font-bold text-center mb-4 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500'>
					Confirm Your Email
				</h1>
				<p className='text-gray-700 text-center mb-6'>
					Thank you for signing up! We’ve sent a confirmation OTP to your email. Please check your inbox, and enter the OTP
					below.
				</p>

				<form onSubmit={handleSubmit} className='flex flex-col items-center'>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-purple-400 to-pink-500'
						placeholder='Enter your email'
					/>
					<input
						type='text'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						className='w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-purple-400 to-pink-500'
						placeholder='Enter your 4-digit OTP'
						maxLength={4}
					/>
					{errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
					{successMessage && <p className='text-green-500 mb-4'>{successMessage}</p>}
					<button
						type='submit'
						className='px-6 py-2 text-white font-bold bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
						disabled={loading} // Disable the button while loading
					>
						{loading ? 'Verifying..' : 'Verify OTP'} {/* Change button text based on loading state */}
					</button>
				</form>

				<div className='flex justify-center mt-4'>
					<Link to='/' className='text-gray-600 hover:underline'>
						Go Back to the Home Page
					</Link>
				</div>
			</div>
		</div>
	);
};

export default EmailConfirm;
