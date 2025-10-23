import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border-b border-gray-800 shadow-xl sticky top-0 z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Mobile Menu Button + Breadcrumb */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Dashboard</span>
              <span className="text-gray-600">/</span>
              <span className="text-white font-semibold">Overview</span>
            </div>
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 relative"
              >
                <Bell className="w-5 h-5" />
                {/* Notification Badge */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-gray-900"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700/50">
                        <p className="text-sm text-white font-medium">New booking received</p>
                        <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                      </div>
                      <div className="p-4 hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-700/50">
                        <p className="text-sm text-white font-medium">Station offline alert</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                      <div className="p-4 hover:bg-gray-700/50 cursor-pointer transition-colors">
                        <p className="text-sm text-white font-medium">System update completed</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900 border-t border-gray-700">
                      <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium w-full text-center transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 border-l border-gray-700 pl-2 sm:pl-4">
              {/* User Info - Hidden on small mobile */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.unique_name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-gray-800">
                <span className="text-white text-sm font-bold">
                  {user?.unique_name ? user.unique_name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;