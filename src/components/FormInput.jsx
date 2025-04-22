export default ({
	label,
	name,
	type = 'text',
	placeholder,
	value,
	onChange,
	required = false,
	error
  }) => (
	<div className="mb-4">
	  <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
		{label} {required && <span className="text-red-500">*</span>}
	  </label>
	  <input
		type={type}
		id={name}
		name={name}
		placeholder={placeholder}
		value={value}
		onChange={onChange}
		required={required}
		className="w-full p-2 border border-gray-300 rounded-md"
	  />
	  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
	</div>
  );
  