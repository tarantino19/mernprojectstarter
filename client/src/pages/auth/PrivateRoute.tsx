import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const fetchAuthStatus = async (): Promise<boolean> => {
	try {
		const response = await axios.get('http://localhost:4000/userApi/auth/status', {
			withCredentials: true, // Ensure cookies are sent with the request
		});

		// Check if the response data contains the authenticated field and if it's true
		return response.data.authenticated === true;
	} catch (error) {
		console.error('Error fetching authentication status:', error);
		return false;
	}
};

const PrivateRoute: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	// Define checkAuth outside of useEffect for clarity and reuse
	const checkAuth = async () => {
		try {
			const authenticated = await fetchAuthStatus();
			setIsAuthenticated(authenticated);
		} catch (error) {
			console.error('Error during authentication check:', error);
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	if (isAuthenticated === null) {
		return <div>Loading...</div>; // Add a loading indicator or spinner here
	}

	return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;
