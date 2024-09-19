import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import SignUpForm from './pages/auth/SignUpForm.tsx';
import LoginForm from './pages/auth/LoginForm.tsx';
import PrivateRoute from './pages/auth/PrivateRoute.tsx';
import './index.css';

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		path: '/',
		element: <PrivateRoute />, // Protect these routes
		children: [
			{
				path: '',
				element: <HomePage />,
			},
			{
				path: 'profile',
				element: <ProfilePage />,
			},
		],
	},
	{
		path: '/signup',
		element: <SignUpForm />, // Public route
	},
	{
		path: '/login',
		element: <LoginForm />, // Public route
	},
	{
		path: '*', // Fallback route
		element: <NotFoundPage />,
	},
]);

const App: React.FC = () => (
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
);

export default App;
