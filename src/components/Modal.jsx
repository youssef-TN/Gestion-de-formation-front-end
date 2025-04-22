import { X } from 'lucide-react';

export default ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed backdrop-blur-sm inset-0 bg-primary  flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-100">
        {/* Fixed header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-xl font-semibold text-[#2F4734]">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scrollable content with subtle scrollbar */}
        <div className="p-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-w-0.5 scrollbar-thumb-rounded-full scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
};