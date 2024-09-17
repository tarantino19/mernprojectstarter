//sample code only

//Parent component - App.tsx or main.tsx
// // Create a client
// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </React.StrictMode>
// );

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface User {
	id: number;
	name: string;
	email: string;
}

const fetchUsers = async (): Promise<User[]> => {
	const response = await axios.get('https://jsonplaceholder.typicode.com/users');
	return response.data;
};

const Users: React.FC = () => {
	// Use the useQuery hook
	const { data, isLoading, isError, error, refetch } = useQuery<User[], Error>({
		queryKey: ['users'],
		queryFn: fetchUsers,
		staleTime: 1000 * 60 * 5, // Data will be fresh for 5 minutes
	});

	if (isLoading) return <div>Loading users...</div>;
	if (isError) return <div>Error fetching users: {error.message}</div>;

	return (
		<div>
			<h1>Users List</h1>
			<button onClick={() => refetch()}>Refetch Users</button>
			<ul>
				{data?.map((user) => (
					<li key={user.id}>
						{user.name} ({user.email})
					</li>
				))}
			</ul>
		</div>
	);
};

export default Users;
