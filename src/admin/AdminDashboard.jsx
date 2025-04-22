import React from 'react';
import { Bell, User, Circle, Activity } from 'lucide-react';

const Dashboard = ({currentUser}) => {
  // État et données pour les activités
  const [loading, setLoading] = React.useState(false);
  const [activities, setActivities] = React.useState([
    { id: 1, type: 'message', title: 'New message from Jane', time: '5 min ago' },
    { id: 2, type: 'file', title: 'Project files uploaded', time: '2 hours ago' },
    { id: 3, type: 'update', title: 'System update completed', time: 'Yesterday' }
  ]);
  
  // Mapping des icônes pour les types d'activités
  const iconMap = {
    message: <Bell className="text-white w-4 h-4" />,
    file: <User className="text-white w-4 h-4" />,
    update: <Activity className="text-white w-4 h-4" />
  };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-[#D9E5D0] rounded-xl overflow-hidden shadow-sm">
          <div className="relative p-8">
            <h2 className="text-3xl font-semibold tracking-wide text-[#2F4734]">Welcome {currentUser.login.charAt(0).toUpperCase() + currentUser.login.slice(1)}</h2>
            <div className="mt-4 text-gray-700 text-lg leading-relaxed">
              <p>
              You are now in control. Manage trainings, trainers, and participants... 
              and shape the platform to fit your vision.
              </p>
            </div>
          </div>
        </div>

        {/* Grid for activities */}
        <div className="">
          {/* Composant de notifications à la place du DashboardCard pour Recent Activities */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold text-[#99BC85] drop-shadow-md">Recent Activities</h2>
              <div className="relative">
                <div className="bg-[#99BC85] p-2 rounded-full shadow-lg">
                  <Activity className="text-black w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#BFD8AF] p-4 rounded-3xl shadow-inner">
              <div className="flex space-x-6 mb-4 px-2">
                <span className="font-semibold text-lg text-white border-b-2 border-white pb-1">Today</span>
                <span className="font-light text-gray-200 pb-1">All</span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="bg-white px-4 py-3 rounded-xl flex items-center justify-center">
                    <p>Loading...</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm hover:shadow-md transition duration-150"
                    >
                      <div className="w-10 h-10 bg-[#99BC85] rounded-full flex items-center justify-center mr-4">
                        {iconMap[activity.type] || <Activity className="text-white w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {!loading && activities.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activities</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;