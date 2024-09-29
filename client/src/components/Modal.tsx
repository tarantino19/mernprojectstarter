import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white w-full max-w-md rounded-lg shadow-lg'>
				<div className='flex justify-between items-center bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-t-lg'>
					<h2 className='text-xl font-bold text-white'>{title}</h2>
					<button onClick={onClose} className='text-white hover:text-gray-200 focus:outline-none'>
						<X size={24} />
					</button>
				</div>
				<div className='p-6'>{children}</div>
				<div className='bg-gray-100 px-4 py-3 rounded-b-lg flex justify-end'>
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

export default Modal;
