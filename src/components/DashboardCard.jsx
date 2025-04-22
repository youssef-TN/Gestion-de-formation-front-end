import { Loader2 } from 'lucide-react';

export default ({ title, children, loading = false }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-[#EAF1E6]">
      <h3 className="text-xl font-semibold text-[#2F4734]">{title}</h3>
    </div>
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-[#99BC85] animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  </div>
);