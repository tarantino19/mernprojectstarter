import React from 'react';

type SearchBarProps = {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
	return (
		<div className='mb-6'>
			<input
				type='text'
				placeholder='Search products...'
				className='w-full p-2 border border-gray-300 rounded'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</div>
	);
};

export default SearchBar;
