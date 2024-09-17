import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ProfilesPage from './pages/ProfilesPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import SignUpForm from './pages/auth/SignUpForm.tsx';
import LoginForm from './pages/auth/LoginForm.tsx';
import LogoutForm from './pages/auth/LogOutForm.tsx';

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
		path: '/logout',
		element: <LogoutForm />,
	},
	{
		path: '/login',
		element: <LoginForm />,
	},
	{
		path: '/profiles',
		element: <ProfilesPage />,
		children: [
			{
				path: ':profileId',
				element: <ProfilePage />,
			},
		],
	},
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
