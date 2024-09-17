import React from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the type for the login form data
interface LoginFormData {
	username: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>(); // Use the LoginFormData type
	const navigate = useNavigate(); // React Router's useNavigate hook

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await axios.post('http://localhost:4000/userApi/login', data);
			console.log('Login response:', response.data);

			// Save the token in localStorage
			localStorage.setItem('authToken', response.data.token);
			// Navigate to the profile page upon successful login
			navigate(`/profiles/${data.username}`);
		} catch (error) {
			// Narrow down the type of error
			if (axios.isAxiosError(error)) {
				// Axios-specific error handling
				if (error.response && error.response.data) {
					alert(error.response.data.error || 'Invalid username or password');
				} else {
					alert('A network error occurred or the request was unsuccessful');
				}
			} else {
				// Handle other unknown errors
				console.error('Unexpected Error:', error);
				alert('An unexpected error occurred');
			}
		}
	};

	return (
		<div className='flex justify-center mt-5'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='mb-4'>
					<label className='mr-5 bg-gray-100'>Username</label>
					<input type='text' {...register('username', { required: 'Username is required' })} />
					{errors.username && <p>{errors.username.message}</p>}
				</div>

				<div className='mb-4'>
					<label className=' mr-5 bg-gray-100'>Password</label>
					<input
						type='password'
						{...register('password', {
							required: 'Password is required',
						})}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>

				<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>
					Log In
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
