export default ({
    label,
    name,
    options = [],
    value,
    onChange,
    placeholder = "Select option",
    required = false,
    error
  }) => {
    return (
      <div className="relative mb-6">
        {/* Label with aligned required indicator */}
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
          </label>
        {/* Select input */}
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full p-2 border border-gray-300 rounded-md ${
              error ? "border-red-500" : ""
            }`}
          >
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                className="hover:bg-blue-100"
              >
                {option.label}
              </option>
            ))}
          </select>          
        
        {/* Error message */}
        {error && (
          <p className="mt-2 text-sm text-red-500 flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  };