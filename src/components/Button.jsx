export default ({ 
	children, 
	variant = 'primary', 
	onClick, 
	icon, 
	className = '',
	...props 
  }) => {
	const baseClasses = 'px-6 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all';
	
	const variantClasses = {
	  primary: 'bg-[#99BC85] hover:bg-[#88a974] text-white',
	  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
	  danger: 'bg-red-500 hover:bg-red-600 text-white'
	};
	
	return (
	  <button
		onClick={onClick}
		className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		{...props}
	  >
		{icon}
		{children}
	  </button>
	);
  };