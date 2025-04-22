import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import User from './user';
import Manager from './Manager';
import Admin from './admin';
import Login from './components/login';
import Loading from './components/Loading'; 

// Auth context to manage authentication state globally
const AuthContext = createContext();

// Custom hook for accessing auth context
const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = JSON.parse(token);
        
        if (userData && userData.role) {
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Error parsing auth token:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        setError('Invalid authentication data. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (userData) => {
    try {
      localStorage.setItem('token', JSON.stringify(userData));
      setCurrentUser(userData);
      setError(null);
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Auth context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    switch (currentUser.role) {
      case 'user':
        return <Navigate to="/user" replace />;
      case 'manager':
        return <Navigate to="/manager" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Component to handle redirect based on user role
const RoleBasedRedirect = () => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (currentUser.role) {
    case 'user':
      return <Navigate to="/user" replace />;
    case 'manager':
      return <Navigate to="/manager" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { loading, error,currentUser } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      {/* Home route redirects based on role */}
      <Route path="/" element={<RoleBasedRedirect />} />
      
      {/* Login route */}
      <Route path="/login" element={<LoginWrapper />} />
      
      {/* Protected routes */}
      <Route 
        path="/user" 
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <User currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/manager" 
        element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <Manager currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route for undefined paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Wrapper for login to handle redirects if already logged in
function LoginWrapper() {
  const { isAuthenticated, login, error } = useAuth();

  if (isAuthenticated) {
    return <RoleBasedRedirect />;
  }

  return <Login onLogin={login} authError={error} />;
}

export default App;