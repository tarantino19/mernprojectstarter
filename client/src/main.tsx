import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ProfilesPage from './pages/ProfilesPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import SignUpForm from './pages/auth/SignUpForm.tsx';
import LoginForm from './pages/auth/LoginForm.tsx';
import LogoutForm from './pages/auth/LogOutForm.tsx';
import PrivateRoute from './pages/auth/PrivateRoute.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
		errorElement: <NotFoundPage />,
	},
	{
		path: '/signup',
		element: <SignUpForm />,
	},
	{
		path: '/login',
		element: <LoginForm />,
	},
	{
		path: '/logout',
		element: <LogoutForm />,
	},
	{
		path: '/profiles',
		element: <PrivateRoute />, // Protect this route
		children: [
			{
				path: '',
				element: <ProfilesPage />,
			},
			{
				path: ':profileId',
				element: <ProfilePage />,
			},
		],
	},
	{
		path: '*', // Fallback route
		element: <NotFoundPage />,
	},
]);

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
