// //sample code only

// //Parent component - App.tsx or main.tsx
// // // Create a client
// // const queryClient = new QueryClient();

// // ReactDOM.createRoot(document.getElementById('root')!).render(
// //   <React.StrictMode>
// //     <QueryClientProvider client={queryClient}>
// //       <App />
// //     </QueryClientProvider>
// //   </React.StrictMode>
// // );

// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// // interface User {
// // 	id: number;
// // 	name: string;
// // 	email: string;
// // }

// // const fetchUsers = async (): Promise<User[]> => {
// // 	const response = await axios.get('https://jsonplaceholder.typicode.com/users');
// // 	return response.data;
// // };

// // const Users: React.FC = () => {
// // 	// Use the useQuery hook
// // 	const { data, isLoading, isError, error, refetch } = useQuery<User[], Error>({
// // 		queryKey: ['users'],
// // 		queryFn: fetchUsers,
// // 		staleTime: 1000 * 60 * 5, // Data will be fresh for 5 minutes
// // 	});

// // 	if (isLoading) return <div>Loading users...</div>;
// // 	if (isError) return <div>Error fetching users: {error.message}</div>;

// // 	return (
// // 		<div>
// // 			<h1>Users List</h1>
// // 			<button onClick={() => refetch()}>Refetch Users</button>
// // 			<ul>
// // 				{data?.map((user) => (
// // 					<li key={user.id}>
// // 						{user.name} ({user.email})
// // 					</li>
// // 				))}
// // 			</ul>
// // 		</div>
// // 	);
// // };

// // export default Users;

// //react query pagination params
// // Express example endpoint for pagination
// //backend for example
// // app.get('/api/items', (req, res) => {
// //   const page = parseInt(req.query.page) || 1;
// //   const limit = 10;
// //   const items = generateItems(); // Function that returns items
// //   const startIndex = (page - 1) * limit;
// //   const endIndex = page * limit;
// //   const paginatedItems = items.slice(startIndex, endIndex);

// //   res.json({
// //     data: paginatedItems,
// //     currentPage: page,
// //     totalPages: Math.ceil(items.length / limit),
// //   });
// // });

// // import { useQuery } from '@tanstack/react-query';
// // import axios from 'axios';

// // Function to fetch paginated data
// const fetchPaginatedData = async (page: number) => {
// 	const { data } = await axios.get(`/api/items?page=${page}`);
// 	return data;
// };

// // React component for pagination
// const PaginatedComponent = () => {
// 	const [page, setPage] = useState(1); // State to track the current page

// 	// Use React Query to fetch paginated data
// 	const { data, isLoading, isError, error } = useQuery(
// 		['items', page], // Query key includes the page number
// 		() => fetchPaginatedData(page), // Query function
// 		{
// 			keepPreviousData: true, // Keep old data while fetching new one
// 			staleTime: 5000, // 5 seconds before considering data stale
// 		}
// 	);

// 	// Handle loading and error states
// 	if (isLoading) return <div>Loading...</div>;
// 	if (isError) return <div>Error: {error.message}</div>;

// 	// Pagination logic
// 	const nextPage = () => setPage((prevPage) => prevPage + 1);
// 	const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

// 	return (
// 		<div>
// 			<h1>Items (Page {page})</h1>

// 			{/* Display the data */}
// 			<ul>
// 				{data.data.map((item: any) => (
// 					<li key={item.id}>{item.name}</li>
// 				))}
// 			</ul>

// 			{/* Pagination Controls */}
// 			<div>
// 				<button onClick={prevPage} disabled={page === 1}>
// 					Previous
// 				</button>
// 				<span>
// 					{' '}
// 					Page {page} of {data.totalPages}{' '}
// 				</span>
// 				<button onClick={nextPage} disabled={page === data.totalPages}>
// 					Next
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

// export default PaginatedComponent;
