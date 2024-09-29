import React from 'react';
import { X } from 'lucide-react';

interface BigModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const BigModal: React.FC<BigModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white w-[60%] h-[87%] rounded-lg shadow-lg flex flex-col'>
				<div className='flex justify-between items-center bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-t-lg'>
					<h2 className='text-xl font-bold text-white'>{title}</h2>
					<button onClick={onClose} className='text-white hover:text-gray-200 focus:outline-none'>
						<X size={24} />
					</button>
				</div>
				<div className='flex-grow flex'>
					<div className='w-[70%] p-6 overflow-y-auto border-r border-gray-200'>
						{/* Left side (70%) content */}
						{children}
					</div>
					<div className='w-[30%] p-6 bg-white' style={{ borderLeft: '1px solid #e5e7eb' }}>
						{/* Right side (30%) for additional details */}
						<p>Additional details or actions here.</p>
					</div>
				</div>
				<div className='px-4 py-3 rounded-b-lg flex justify-end'>
					<button
						onClick={onClose}
						className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105'
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default BigModal;
