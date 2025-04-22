import React from 'react';
import { Bell, User, Circle, Activity } from 'lucide-react';
import {fetchRecentActivities} from "../api/dashboardApi"; 
import RecentActivities from "../components/RecentActivities"; // Assuming you have a RecentActivities component

const Dashboard = ({currentUser}) => {
  // État et données pour les activités
  const [loading, setLoading] = React.useState(false);
  const [recentActivities, setRecentActivities] = React.useState([]);
  
  React.useEffect(() => {
    loadActivities();
    }, []);

  const loadActivities = async () => {
		try {
		  setLoading(true);
		  const data = await fetchRecentActivities(true);
      console.log('Fetched recent activities:', data); // Log the fetched data
		  setRecentActivities(data);
		} catch (error) {
		  console.error("Failed to fetch recent activities:", error);
		} finally {
		  setLoading(false);
		}
	  };
  
  // Mapping des icônes pour les types d'activités
  const iconMap = {
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
            <RecentActivities recentActivities={recentActivities} loading={loading} iconMap={iconMap} formatTimeAgo={formatTimeAgo} />
            {/* <div className="bg-[#BFD8AF] p-4 rounded-3xl shadow-inner">
              <div className="flex space-x-6 mb-4 px-2">
                <span className="font-semibold text-lg text-white border-b-2 border-white pb-1">Users</span>
                <span className="font-light text-gray-200 pb-1">Participants</span>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="bg-white px-4 py-3 rounded-xl flex items-center justify-center">
                    <p>Loading...</p>
                  </div>
                ) : (
                  recentActivities?.users?.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm hover:shadow-md transition duration-150"
                    >
                      <div className="w-10 h-10 bg-[#99BC85] rounded-full flex items-center justify-center mr-4">
                        {iconMap["update"] || <Activity className="text-white w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          New User <span className="text-sm text-[#99BC85] font-bold ">{activity.login}</span> has been updated
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(activity.updatedAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {!loading && recentActivities?.users?.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No recent activities</p>
                )}
              </div>
            </div>*/}
          </div> 
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

export default Dashboard;