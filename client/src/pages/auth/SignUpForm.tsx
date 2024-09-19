import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface SignUpFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string;
	avatar?: string;
	isAdmin?: boolean;
}

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>();

	const navigate = useNavigate(); // Initialize navigate

	const onSubmit = async (data: SignUpFormData) => {
		try {
			const response = await axios.post('http://localhost:4000/userApi/signup', data);
			alert(response.data.message || 'Signup successful!');
			navigate('/login'); // Redirect to login page on success
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.data) {
					alert(error.response.data.error || 'An error occurred during signup');
				} else {
					alert('A network error occurred or the request was unsuccessful');
				}
			} else {
				console.error('Unexpected Error:', error);
				alert('An unexpected error occurred');
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
				<h1 className='text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-green-400'>
					Create Your Account!
				</h1>
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
								validate: (value, { password }) => value === password || 'Passwords do not match',
							})}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
						{errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>}
					</div>

					<div className='mb-4'>
						<label className='block text-gray-700 font-bold mb-2' htmlFor='avatar'>
							Avatar (Optional)
						</label>
						<input
							id='avatar'
							type='text'
							{...register('avatar')}
							className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gradient-to-r from-red-400 via-yellow-500 to-green-400'
						/>
					</div>

					<button
						type='submit'
						className='w-full py-3 bg-gradient-to-r from-red-400 via-yellow-500 to-green-400 text-white font-bold rounded-lg hover:from-red-500 hover:via-yellow-600 hover:to-green-500 transition-all'
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
