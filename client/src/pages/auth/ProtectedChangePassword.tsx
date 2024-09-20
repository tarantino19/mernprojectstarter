import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ChangePassword from './ChangePassword';

const ProtectedChangePassword: React.FC = () => {
	const { token } = useParams(); // Extract token from URL params
	const navigate = useNavigate();
	const [validToken, setValidToken] = useState<boolean | null>(null);

	// Check token validity when the component mounts
	useEffect(() => {
		const verifyToken = async () => {
			try {
				const response = await axios.get(`http://localhost:4000/userApi/verify-reset-token/${token}`);
				if (response.status === 200) {
					setValidToken(true); // Token is valid
				}
			} catch (error) {
				setValidToken(false); // Token is invalid
			}
		};

		verifyToken();
	}, [token]);

	useEffect(() => {
		// Redirect to login page if the token is invalid
		if (validToken === false) {
			setTimeout(() => {
				navigate('/login'); // Redirect to login after showing the message
			}, 3000); // 3 second delay before redirect
		}
	}, [validToken, navigate]);

	if (validToken === null) {
		// Still checking the token, show loading or a spinner
		return <div>Loading...</div>;
	}

	if (!validToken) {
		// Token is invalid, show error message and navigate to login after delay
		return (
			<div>
				<p>Invalid or expired token. Redirecting to login...</p>
			</div>
		);
	}

	// If token is valid, render the change password form
	return <ChangePassword />;
};

export default ProtectedChangePassword;
