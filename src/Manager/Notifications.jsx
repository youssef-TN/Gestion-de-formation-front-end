//const Notifications = () => {
//    return (
////      <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
//        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notifications</h2>
//        <p className="text-gray-600">View and manage your notifications here.</p>
//      </div>
//    );
//  };
  
//  export default Notifications;

// Notifications.jsx
// Notifications.jsx
import { useState } from 'react';
import { Bell, Circle, User } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, name: 'John Doe', message: 'New training added', unread: true },
    { id: 2, name: 'John Doe', message: 'Training updated', unread: true },
    { id: 3, name: 'Jane Smith', message: 'Your profile has been reviewed', unread: true },
    { id: 4, name: 'John Doe', message: 'You have been assigned to a new structure', unread: false },
    { id: 5, name: 'Jane Smith', message: 'Session feedback received', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-[#99BC85] drop-shadow-md">Notifications</h2>
        <div className="relative">
          <div className="bg-[#99BC85] p-2 rounded-full shadow-lg">
            <Bell className="text-black w-6 h-6" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#BFD8AF] p-4 rounded-3xl shadow-inner">
        <div className="flex space-x-6 mb-4 px-2">
          <span className="font-semibold text-lg text-white border-b-2 border-white pb-1">Today</span>
          <span className="font-light text-gray-200 pb-1">Read</span>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white px-4 py-3 rounded-xl flex items-center shadow-sm hover:shadow-md transition duration-150"
            >
              <div className="w-10 h-10 bg-[#99BC85] rounded-full flex items-center justify-center mr-4">
                <User className="text-white w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{n.name}</span> - {n.message}
                </p>
              </div>
              {n.unread && (
                <Circle className="w-3 h-3 text-red-500" fill="red" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

