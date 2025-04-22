import { useState } from 'react';
import { Activity } from 'lucide-react';

const TabsComponent = ({ recentActivities, loading, iconMap, formatTimeAgo }) => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users', data: recentActivities?.users || [] },
    { id: 'participants', label: 'Participants', data: recentActivities?.participants || [] },
    { id: 'trainers', label: 'Trainers', data: recentActivities?.trainers || [] },
    { id: 'trainings', label: 'Trainings', data: recentActivities?.trainings || [] }
  ];

  return (
    <div className="bg-[#BFD8AF] p-4 rounded-3xl shadow-inner">
      <div className="flex space-x-6 mb-4 px-2">
        {tabs.map(tab => (
          <span 
            key={tab.id}
            className={`${
              activeTab === tab.id 
                ? "font-semibold text-lg text-white border-b-2 border-white" 
                : "font-light text-gray-200 cursor-pointer hover:text-white"
            } pb-1 transition-all duration-200`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </span>
        ))}
      </div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {loading ? (
          <div className="bg-white px-4 py-3 rounded-xl flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          tabs.find(tab => tab.id === activeTab)?.data.map((activity) => (
            <div
              key={activity.id}
              className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm hover:shadow-md transition duration-150"
            >
              <div className="w-10 h-10 bg-[#99BC85] rounded-full flex items-center justify-center mr-4">
                {iconMap[activeTab] || <Activity className="text-white w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  {activeTab === 'users' && (
                    <>New User <span className="text-sm text-[#99BC85] font-bold">{activity.login}</span> has been updated</>
                  )}
                  {activeTab === 'participants' && (
                    <>Participant <span className="text-sm text-[#99BC85] font-bold">{activity.firstName} {activity.lastName}</span> has joined</>
                  )}
                  {activeTab === 'trainers' && (
                    <>Trainer <span className="text-sm text-[#99BC85] font-bold">{activity.firstName} {activity.lastName}</span> has been assigned</>
                  )}
                  {activeTab === 'trainings' && (
                    <>Training <span className="text-sm text-[#99BC85] font-bold">{activity.title}</span> has been updated</>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(activity.updatedAt)}
                </p>
              </div>
            </div>
          ))
        )}
        {!loading && tabs.find(tab => tab.id === activeTab)?.data.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent {activeTab}</p>
        )}
      </div>
    </div>
  );
};

export default TabsComponent;