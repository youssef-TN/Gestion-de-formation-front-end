export default ({
    label,
    name,
    options = [],
    value,
    onChange,
    required = false,
    error
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex-1 flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label 
              htmlFor={`${name}-${option.value}`} 
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );