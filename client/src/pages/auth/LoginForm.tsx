import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

	const onSubmit = async (data: LoginFormData) => {
		try {
			setLoading(true);
			console.log('Submitting login form with data:', data);

			const response = await axios.post('http://localhost:4000/userApi/login', data, {
				withCredentials: true,
			});

			console.log('Login response:', response.data);

			if (response.data.message === 'You are now logged in. User is now authenticated') {
				navigate('/');
			} else {
				alert('Unexpected response from server');
			}
		} catch (error) {
			console.error('Login error:', error);
		} finally {
			setLoading(false);
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
					<label className='mr-5 bg-gray-100'>Password</label>
					<input type='password' {...register('password', { required: 'Password is required' })} />
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
