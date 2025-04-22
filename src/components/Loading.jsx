import React from 'react';

/**
 * Loading component for displaying during authentication checks and data fetching
 * @param {Object} props - Component props
 * @param {string} props.message - Optional custom loading message
 * @param {string} props.size - Size of the spinner ('small', 'medium', 'large')
 * @param {boolean} props.fullScreen - Whether the loading should take up the full screen
 * @param {string} props.color - Primary color for the spinner
 */
const Loading = ({ 
  message = 'Loading...', 
  size = 'medium', 
  fullScreen = false,
  color = '#4F46E5' // Default to indigo-600
}) => {
  // Calculate the size of the spinner
  const spinnerSizes = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  // Calculate the font size based on spinner size
  const fontSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };
  
  const spinnerSize = spinnerSizes[size] || spinnerSizes.medium;
  const fontSize = fontSizes[size] || fontSizes.medium;
  
  // Container classes based on fullScreen prop
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50' 
    : 'flex flex-col items-center justify-center p-6';

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative">
          {/* Background spinner */}
          <div className={`${spinnerSize} rounded-full border-4 border-gray-200`}></div>
          
          {/* Animated spinner */}
          <div 
            className={`absolute top-0 left-0 ${spinnerSize} rounded-full border-4 border-transparent`}
            style={{ 
              borderTopColor: color,
              animation: 'spin 1s linear infinite'
            }}
          ></div>
        </div>
        
        {/* Loading text */}
        {message && (
          <p className={`mt-3 ${fontSize} text-gray-700 text-center`}>
            {message}
          </p>
        )}
      </div>
      
      {/* CSS for the spinning animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * LoadingButton - A button with loading state
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.loadingText - Text to show during loading
 * @param {function} props.onClick - Click handler
 * @param {ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Whether the button is disabled
 */
export const LoadingButton = ({
  isLoading,
  loadingText = "Loading...",
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="absolute left-4 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={isLoading ? "pl-6" : ""}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
};

/**
 * LoadingOverlay - A component for showing loading states over existing content
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the overlay is active
 * @param {string} props.message - Optional message to display
 * @param {ReactNode} props.children - Content to render underneath the overlay
 */
export const LoadingOverlay = ({ 
  active = false, 
  message = "Loading...", 
  children 
}) => {
  return (
    <div className="relative">
      {children}
      
      {active && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Loading message={message} />
        </div>
      )}
    </div>
  );
};

export default Loading;