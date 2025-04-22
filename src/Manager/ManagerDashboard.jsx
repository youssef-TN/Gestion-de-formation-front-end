import { useState, useEffect } from 'react';
import { Activity, Calendar, Users, UserCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import DashboardCard from '../components/DashboardCard';
import { fetchRecentActivities, fetchStats } from '../api/dashboardApi';

export default () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrainings: 0,
    activeTrainers: 0,
    participants: 0,
    completionRate: 0
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // const [statsData, activitiesData] = await Promise.all([
        //   fetchStats(),
        //   fetchRecentActivities()
        // ]);
        
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // You could set some error state here
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const iconMap = {
    training: <Calendar className="w-5 h-5" />,
    participant: <Users className="w-5 h-5" />,
    trainer: <UserCheck className="w-5 h-5" />
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#D9E5D0] rounded-xl overflow-hidden shadow-sm">
        <div className="relative p-8">
          <div className="absolute right-5 top-1/2 pt-8 transform -translate-y-1/2">
            
            <img 
            src="src\assets\logo_green_building-removebg-preview.png" 
           alt="Profile Icon" 
           class="w-20 h-20 rounded-full object-cover"
         />
           
          </div>
          
          <h2 className="text-3xl font-semibold tracking-wide text-[#2F4734]">Welcome Your Analytics Hub! Sofien</h2>
          
          <div className="mt-4 text-gray-700 text-lg leading-relaxed">
            <p>
            
            As a Statistics Manager, you have access to key insights and data to track performance, trends, and results. Dive into the metrics that matter and use them to drive informed decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Activities Card */}
        <DashboardCard title="Recent Activities" loading={loading}>
          <ul className="space-y-4">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                icon={iconMap[activity.type] || <Activity />}
                title={activity.title}
                time={activity.time}
              />
            ))}
            {!loading && activities.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activities</p>
            )}
          </ul>
        </DashboardCard>
        
        {/* Quick Stats Card */}
        <DashboardCard title="Quick Stats" loading={loading}>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label="Total Trainings" 
              value={stats.totalTrainings} 
            />
            <StatCard 
              label="Active Trainers" 
              value={stats.activeTrainers} 
            />
            <StatCard 
              label="Participants" 
              value={stats.participants} 
            />
            <StatCard 
              label="Completion Rate" 
              value={`${stats.completionRate}%`} 
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};