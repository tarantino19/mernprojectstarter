import { useForm } from 'react-hook-form';
import axios from 'axios';

export interface SignUpFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string; // Only used in the form for validation
	avatar?: string; // Optional field
	isAdmin?: boolean; // Optional, defaulting to `false` in the backend
}

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignUpFormData>(); // Use the SignupFormData type

	const onSubmit = async (data: SignUpFormData) => {
		try {
			const response = await axios.post('http://localhost:4000/userApi/signup', data);
			alert(response.data.message || 'Signup successful!');
		} catch (error) {
			// Narrow down the type of error
			if (axios.isAxiosError(error)) {
				// Axios-specific error handling
				if (error.response && error.response.data) {
					alert(error.response.data.error || 'An error occurred during signup');
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
		<div className='p-4'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label className='mr-2 bg-gray-300'>Username</label>
					<input type='text' {...register('username', { required: 'Username is required' })} />
					{errors.username && <p>{errors.username.message}</p>}
				</div>

				<div>
					<label className='mr-2 bg-gray-300'>Email</label>
					<input
						type='email'
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^\S+@\S+$/i,
								message: 'Invalid email format',
							},
						})}
					/>
					{errors.email && <p>{errors.email.message}</p>}
				</div>

				<div>
					<label className='mr-2 bg-gray-300'>Password</label>
					<input
						type='password'
						{...register('password', {
							required: 'Password is required',
							minLength: {
								value: 6,
								message: 'Password must be at least 6 characters',
							},
						})}
					/>
					{errors.password && <p>{errors.password.message}</p>}
				</div>

				<div>
					<label className='mr-2 bg-gray-300'>Confirm Password</label>
					<input
						type='password'
						{...register('confirmPassword', {
							required: 'Please confirm your password',
							validate: (value, { password }) => value === password || 'Passwords do not match',
						})}
					/>
					{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
				</div>

				<div>
					<label className='mr-2 bg-gray-300'>Avatar</label>
					<input type='text' {...register('avatar')} />
				</div>

				<button className='mr-2 bg-gray-300' type='submit'>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignUpForm;
