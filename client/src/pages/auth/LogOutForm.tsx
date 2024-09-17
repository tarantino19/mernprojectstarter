import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Function to clear token from localStorage and cookies
const clearAuthToken = () => {
	// Clear cookies by setting their expiry date to a past date
	document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

const LogoutForm: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			// Notify the server about the logout (invalidate session)
			await axios.post(
				'http://localhost:4000/userApi/logout',
				{},
				{
					withCredentials: true, // Ensure cookies are sent with the request
				}
			);

			clearAuthToken();

			// Redirect to the login page
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<div className='logout-form'>
			<button onClick={handleLogout} className='logout-button bg-pink-400'>
				Logout
			</button>
		</div>
	);
};

export default LogoutForm;
