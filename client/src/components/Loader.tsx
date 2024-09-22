const Loader = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh', // Full viewport height
				background: 'linear-gradient(to right, #2ef3a4, #0072ff)', // Green to blue gradient
			}}
		>
			<div
				style={{
					border: '8px solid rgba(255, 255, 255, 0.3)', // Semi-transparent border
					borderTop: '8px solid white', // Solid white for contrast
					borderRadius: '50%', // Ensures it's a circle
					width: '15vw', // 15% of viewport width
					height: '15vw', // Equal to the width to ensure it's a circle
					animation: 'spin 1s linear infinite',
				}}
			></div>

			{/* Add keyframes for the spin animation */}
			<style>
				{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
			</style>
		</div>
	);
};

export default Loader;
