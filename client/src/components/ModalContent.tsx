import { useState } from 'react';
import Modal from './Modal';

const ModalContent: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className='p-4'>
			<button
				onClick={() => setIsModalOpen(true)}
				className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105'
			>
				Open Modal
			</button>
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Example Modal'>
				<p>This is the content of the modal. You can put anything here!</p>
			</Modal>
		</div>
	);
};

export default ModalContent;
