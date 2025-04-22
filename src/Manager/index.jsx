
import { useState } from 'react';
import Statistics from './Statistics';
import Notifications from './Notifications'; // Make sure this component exists
import ManagerDashboard from './ManagerDashboard'; // Make sure this component exists

const COLORS = {
  primary: '#99BC85',   
  secondary: '#D9E5D0',
  light: '#EAF1E6',
  dark: '#2F4734',
};

const NAV_ITEMS = [
  { name: 'Home', icon: 'home' },
  { name: 'Statistics', icon: 'statistics' },
  { name: 'Notifications', icon: 'notifications' },
  { name: 'Quit', icon: 'quit' },
];

// SVG icon component for better organization
const NavIcon = ({ icon }) => {
  switch (icon) {
    case 'home':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case 'statistics':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18M3 3l18 18M3 21h18M12 9v6m-3-3h6m-9 0h6m-3-3v6m0-6H9m3 0h6m-9 0v6m0-6H9m3 0h6" />
        </svg>
      );
    case 'notifications':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      );
    case 'quit':
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
      );
    default:
      return null;
  }
};

export default function ManagerApp() {
  const [display, setDisplay] = useState(NAV_ITEMS[0].name); // Changed to start with first item

  return (
    <div className="flex font-sans bg-gray-50 h-screen">
      {/* Sidebar */}
      <aside 
        className="w-64 relative shadow-lg flex flex-col" 
        style={{ backgroundColor: COLORS.primary }}
        aria-label="Main Navigation"
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20"></div>
        
        {/* User Profile with SVG Avatar */}
        <div className="flex items-center p-6 mt-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow-inner overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke={COLORS.dark} strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-white text-opacity-90 tracking-wide">Manager</h3>
        </div>
        
        {/* Navigation */}
        <nav className="mt-10 px-4 flex-1" aria-label="Main Navigation">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => setDisplay(item.name)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                    display === item.name
                      ? 'bg-white bg-opacity-90 text-gray-800 shadow-sm font-medium' 
                      : 'text-white text-opacity-90 hover:bg-white hover:bg-opacity-20'
                  }`}
                  aria-current={display === item.name ? 'page' : undefined}
                >
                  <div className="w-10 flex justify-center mr-3">
                    <NavIcon icon={item.icon} />
                  </div>
                  <span className="text-lg font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom decorative pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-5" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {display === NAV_ITEMS[0].name && <ManagerDashboard/>}
        {display === NAV_ITEMS[1].name && <Statistics />}
        {display === NAV_ITEMS[2].name && <Notifications />}
        {/* Quit functionality would need to be implemented */}
      </main>
    </div>
  );
}

