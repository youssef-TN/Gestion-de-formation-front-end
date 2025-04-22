// Statistics.jsx
import { BarChart2, BookOpen, DollarSign, Users, GraduationCap } from 'lucide-react';

export default function Statistics() {
  // Chart data
  const chartData = [
    { month: 'January', value: 15 },
    { month: 'February', value: 45 },
    { month: 'March', value: 35 },
    { month: 'April', value: 10 },
    { month: 'May', value: 60 }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-green-300 text-3xl font-bold">Statistics</h2>
        <div className="flex items-center">
          <span className="text-green-700 font-bold mr-1">Green Building</span>
          <div className="w-6 h-6 bg-green-700 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm flex justify-between">
        <div className="flex flex-col items-center">
          <div className="bg-green-200 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <div className="bg-black rounded-md w-10 h-10 flex items-center justify-center">
              <BookOpen size={24} color="white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold">31</h3>
          <p className="text-gray-700">Training</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-200 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <div className="bg-black rounded-md w-10 h-10 flex items-center justify-center">
              <DollarSign size={24} color="white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold">31</h3>
          <p className="text-gray-700">Training</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-200 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <div className="bg-black rounded-md w-10 h-10 flex items-center justify-center">
              <Users size={24} color="white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold">27</h3>
          <p className="text-gray-700">Participant</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-200 rounded-full w-16 h-16 flex items-center justify-center mb-3">
            <div className="bg-black rounded-md w-10 h-10 flex items-center justify-center">
              <GraduationCap size={24} color="white" />
            </div>
          </div>
          <h3 className="text-4xl font-bold">10</h3>
          <p className="text-gray-700">Trainers</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mx-16">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-green-200 rounded-full w-16 h-16 flex items-center justify-center">
            <BarChart2 size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 pt-10 shadow-sm">
          <h4 className="text-gray-400 text-center mb-4 text-sm">Training</h4>
          <div className="text-gray-400 text-center text-xs mb-2">data will be here</div>
          
          <div className="h-64 flex items-end justify-between px-4">
            {chartData.map((item) => (
              <div key={item.month} className="flex flex-col items-center">
                <div 
                  className="bg-green-200 w-8 rounded-t-md"
                  style={{ height: `${(item.value / maxValue) * 150}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 text-xs text-gray-500">
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-green-800 mr-1"></div>
              <span>Initial Training</span>
            </div>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-green-400 mr-1"></div>
              <span>Recurring training</span>
            </div>
            <div className="flex items-center mx-2">
              <div className="w-3 h-3 bg-green-200 mr-1"></div>
              <span>Prevention Training</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}