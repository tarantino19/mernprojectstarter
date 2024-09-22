import React from 'react';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import SignUpForm from './pages/auth/SignUpForm.tsx';
import LoginForm from './pages/auth/LoginForm.tsx';
import PrivateRoute from './pages/auth/PrivateRoute.tsx';
import EmailConfirm from './pages/auth/EmailConfirm.tsx';
import ForgotPassword from './pages/auth/ForgotPassword.tsx';
import ChangePassword from './pages/auth/ChangePassword.tsx';
import AboutPage from './pages/auth/AboutPage.tsx';
import Products from './pages/Products.tsx';
import GifGrid from './pages/GifGrid.tsx';
import ProductDetails from './pages/ProductDetails.tsx';

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
			{
				path: 'about-page',
				element: <AboutPage />,
			},
			{
				path: 'products',
				element: <Products />,
			},
			{
				path: 'products/:productId',
				element: <ProductDetails />,
			},
			{
				path: 'rick',
				element: <GifGrid />,
			},
		],
	},
	{
		path: '/signup',
		element: <SignUpForm />, // Public route
	},
	{
		path: '/email-confirmation',
		element: <EmailConfirm />,
	},
	{
		path: '/change-password',
		element: <ChangePassword />,
	},
	{
		path: '/forgot-password',
		element: <ForgotPassword />,
	},
	{
		path: '/login',
		element: <LoginForm />,
	},
	{
		path: '*', // Fallback route
		element: <NotFoundPage />,
	},
]);

const App: React.FC = () => (
	<QueryClientProvider client={queryClient}>
		<div className='min-h-screen bg-gray-100'>
			<RouterProvider router={router} />
		</div>
	</QueryClientProvider>
);

export default App;
