export default ({
    label = "Duration (days)",
    name,
    value = 1,
    onChange,
    required = false,
    error,
    min = 1,
    max = 365
  }) => {
    // Convert value to number for internal calculations
    const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
    
    const increment = () => {
      const newValue = Math.min(max, numValue + 1);
      onChange({ target: { name, value: newValue } });
    };
    
    const decrement = () => {
      const newValue = Math.max(min, numValue - 1);
      onChange({ target: { name, value: newValue } });
    };
    
    return (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrement}
            className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 text-xl font-medium"
          >
            -
          </button>
          
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-32 h-12 px-4 py-2 border border-gray-200 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          
          <button
            type="button"
            onClick={increment}
            className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md hover:bg-gray-200 text-xl font-medium"
          >
            +
          </button>
          
          <span className="text-gray-700 ml-1">days</span>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };