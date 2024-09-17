const Loader = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh', // Full viewport height
			}}
		>
			<div
				style={{
					border: '4px solid #f472b6',
					borderTop: '4px solid transparent',
					borderRadius: '50%',
					width: '64px',
					height: '64px',
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
