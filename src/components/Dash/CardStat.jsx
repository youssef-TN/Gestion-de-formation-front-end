export default function StatCard({ title, value, change, icon, color }) {
    const isPositive = change >= 0;
    
    return (
      <div className={`${color} p-6 rounded-lg shadow text-white`}>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className={`mt-2 text-sm ${isPositive ? 'text-green-100' : 'text-red-100'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last period
        </div>
      </div>
    );
  }