import AdminDashboard from "./AdminDashboard";
import Trainings from "../user/Trainings";
import Trainers from "../user/Trainers";
import Participants from "../user/Participants";
import User from "./Users";
import { useState, useEffect } from "react";

// Theme colors with proper naming for better organization
const THEME = {
  primary: "#99BC85",
  secondary: "#D9E5D0",
  light: "#EAF1E6",
  dark: "#2F4734",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    800: "#1F2937",
  },
};

// Navigation data with more descriptive attributes
const NAV_ITEMS = [
  { id: "home", name: "Home", icon: "home", description: "Dashboard overview" },
  {
    id: "trainings",
    name: "Trainings",
    icon: "training",
    description: "Manage training sessions",
  },
  {
    id: "trainers",
    name: "Trainers",
    icon: "trainers",
    description: "Manage trainers",
  },
  {
    id: "participants",
    name: "Participants",
    icon: "participants",
    description: "Manage participants",
  },
  { id: "users", name: "Users", icon: "user", description: "Manage users" },
  {
    id: "logout",
    name: "Logout",
    icon: "quit",
    description: "Sign out of system",
  },
];

// SVG icon component with better accessibility attributes
const NavIcon = ({ icon, isActive }) => {
  // Base styling for all icons
  const baseStyle = "w-6 h-6";
  const iconColor = isActive ? THEME.dark : "currentColor";

  switch (icon) {
    case "home":
      return (
        <svg
          className={baseStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      );
    case "training":
      return (
        <svg
          className={baseStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      );
    case "trainers":
      return (
        <svg
          className={baseStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    case "participants":
      return (
        <svg
          className={baseStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    case "user":
      <svg
        className={baseStyle}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M12 14.25a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 1.125c-3.75 0-7.125 1.875-7.125 5.625v1.125h14.25V21c0-3.75-3.375-5.625-7.125-5.625z" />
      </svg>;
    case "quit":
      return (
        <svg
          className={baseStyle}
          viewBox="0 0 24 24"
          fill="none"
          stroke={iconColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const NavButton = ({ isActive, onClick, icon, children, description }) => {
  return (
    <button
      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 ${
        isActive
          ? "bg-white text-gray-800 shadow-sm font-medium"
          : "text-white text-opacity-90 hover:bg-black hover:bg-opacity-20 hover:text-white hover:cursor-pointer"
      }`}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      aria-label={description}
    >
      <div className="w-10 flex justify-center mr-3">
        <NavIcon icon={icon} isActive={isActive} />
      </div>
      <span className="text-lg font-medium">{children}</span>
    </button>
  );
};

// Main component
export default ({ currentUser }) => {
  // Store active section in state - default to the first nav item
  const [activeSection, setActiveSection] = useState(NAV_ITEMS[0].id);
  // Mock effect to demonstrate loading user data - can be replaced with real data fetching
  useEffect(() => {
    // Simulate fetching user profile
    const timer = setTimeout(() => {}, 500);
    return () => clearTimeout(timer);
  }, []);

    
  // Handle navigation changes
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from local storage
    window.location.reload();
  };

  // Determine which component to render based on active section
  const renderContent = () => {
    switch (activeSection) {
      case NAV_ITEMS[0].id:
        return <AdminDashboard currentUser={currentUser} />;
      case NAV_ITEMS[1].id:
        return <Trainings />;
      case NAV_ITEMS[2].id:
        return <Trainers />;
      case NAV_ITEMS[3].id:
        return <Participants />;
      case NAV_ITEMS[4].id:
        return <User />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            Select a section
          </div>
        );
    }
  };

  return (
    <div className="flex font-sans min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className="w-64 flex flex-col relative shadow-lg"
        style={{ backgroundColor: THEME.primary }}
        aria-label="Main Navigation"
      >
        {/* Decorative top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20"></div>

        {/* User Profile with Avatar */}
        <div className="flex items-center p-6 mt-2 border-b border-white border-opacity-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-4 shadow-inner overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 24 24"
              fill="none"
              stroke={THEME.dark}
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white text-opacity-90 tracking-wide">
              {currentUser.login.charAt(0).toUpperCase() +
                currentUser.login.slice(1)}
            </h3>
            <p className="text-sm text-white text-opacity-70">Administrator</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1" aria-label="Main Navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                {item.id === "logout" ? (
                  <NavButton
                    icon={item.icon}
                    description={item.description}
                    onClick={handleLogout}
                    isActive={false}
                  >
                    {item.name}
                  </NavButton>
                ) : (
                  <div className="relative">
                    <NavButton
                      icon={item.icon}
                      description={item.description}
                      onClick={() => handleNavigation(item.id)}
                      isActive={activeSection === item.id}
                    >
                      {item.name}
                    </NavButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Environment indicator - useful for dev/prod differentiation */}
        <div className="mt-auto px-6 py-4 text-xs text-white text-opacity-60">
          <p>Environment: Development</p>
          <p>Version: 1.0.0</p>
        </div>

        {/* Bottom decorative pattern */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 opacity-5"
          aria-hidden="true"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="dots"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="5" cy="5" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header with breadcrumbs */}
        <header className="bg-white shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">
                {NAV_ITEMS.find((item) => item.id === activeSection)?.name ||
                  "Dashboard"}
              </h2>
              <nav className="text-sm" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <span className="text-gray-500">Home{" > "}</span>
                  </li>
                  <li>
                    <span className="text-gray-800">
                      {NAV_ITEMS.find(
                        (item, index) => item.id === activeSection && index != 0
                      )?.name || "Dashboard"}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <img
                src="src\assets\logo_green_building-removebg-preview.png"
                alt="Profile Icon"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Dynamic content area */}
        <div className="flex-1 p-8 overflow-auto">{renderContent()}</div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-8 py-3">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2025 Green Building</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-700">
                Terms
              </a>
              <a href="#" className="hover:text-gray-700">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-700">
                Help
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};
