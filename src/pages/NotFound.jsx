import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Home, 
  ArrowLeft, 
  LayoutDashboard, 
  Calendar, 
  Zap, 
  Users 
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/bookings', name: 'Bookings', icon: Calendar },
    { path: '/stations', name: 'Stations', icon: Zap },
    { path: '/users', name: 'Users', icon: Users }
  ];

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
          {/* Error Icon and Code */}
          <div className="space-y-3">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-gray-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-gray-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-bold text-black">404</h1>
              <h2 className="text-xl font-semibold text-gray-900">Page Not Found</h2>
              <p className="text-sm text-gray-600">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="w-full inline-flex items-center justify-center space-x-2 bg-black text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
            
            <button
              onClick={handleGoBack}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Navigation Links */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-2 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <link.icon className="w-4 h-4 text-gray-600 group-hover:text-black" />
                  <span className="text-xs font-medium text-gray-700 group-hover:text-black">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Support Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Error Code: 404 • Need help? Contact our support team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;