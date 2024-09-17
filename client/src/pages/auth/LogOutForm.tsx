import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Function to clear token from localStorage and cookies
const clearAuthToken = () => {
	localStorage.removeItem('authToken');
	// If using cookies, you can clear it like this
	// document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

const LogoutForm: React.FC = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			// Optionally, notify the server about the logout (e.g., invalidate session)
			await axios.post('http://localhost:4000/userApi/logout'); // Adjust endpoint if needed

			// Clear token from storage
			clearAuthToken();

			// Redirect to the login page or home page
			navigate('/login');
		} catch (error) {
			// Handle error
			console.error('Logout error:', error);
			alert('An error occurred while logging out. Please try again.');
		}
	};

	return (
		<div className='logout-form'>
			<button onClick={handleLogout} className='logout-button bg-pink-400 '>
				Logout
			</button>
		</div>
	);
};

export default LogoutForm;
