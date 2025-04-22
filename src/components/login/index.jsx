import { useState } from 'react';
import login_picture from '../../assets/Webinar-pana.svg';
import axios from 'axios';

export default function Login({ onLogin, authError }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/users/auth', { login, password });
      // Use the onLogin function from auth context instead of directly setting localStorage
      const success = onLogin(response.data);
      
      if (!success) {
        setError('Failed to process login');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Display auth context error if present
  const displayError = authError || error;

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-8 mt-16">
      <div className="w-full max-w-5xl flex rounded-xl shadow-lg overflow-hidden bg-white">
        {/* Left section - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light text-[#C1C2C0]">Login</h2>
            <div className="mt-2 h-1 w-16 bg-[#99BC85] mx-auto rounded-full"></div>
          </div>
          
          {displayError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 rounded-md text-center text-sm">
              {displayError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="mb-6">
              <label className="block text-gray-500 text-sm font-medium mb-2" htmlFor="login">
                Login
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  className="bg-[#FAF1E6] appearance-none rounded-lg w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:ring-opacity-50 transition-all duration-200"
                  id="login"
                  type="login"
                  placeholder="Please write your login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-gray-500 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  className="bg-[#FAF1E6] appearance-none rounded-lg w-full py-3 pl-10 pr-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:ring-opacity-50 transition-all duration-200"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-[#99BC85] hover:text-[#8aad77] transition-colors duration-200">Forgot password?</a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#99BC85] hover:bg-[#8aad77] text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99BC85] transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : 'Login'}
            </button>
          </form>
        </div>
        
        {/* Right section - Image/Illustration */}
        <div className="hidden md:block md:w-1/2 bg-[#FDFAF6] p-8">
          <div className="h-full flex items-center justify-center">
            {/* Placeholder for your image */}
            <div className="text-center">
              <div className="w-full h-80 bg-[#FAF1E6] rounded-lg flex items-center justify-center shadow-inner">
                <img src={login_picture} alt="login picture" className='h-full w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}