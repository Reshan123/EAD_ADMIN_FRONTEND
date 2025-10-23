import React from 'react';
import { 
  Calendar, 
  Zap, 
  Plug, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  Plus,
  Users,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import {useAuth} from "../../hooks/useAuth"

const Dashboard = () => {
  const stats = {
    totalBookings: 156,
    activeBookings: 23,
    totalStations: 12,
    availableStations: 8,
    totalRevenue: '$2,450',
    monthlyGrowth: '+12%'
  };

  const { user } = useAuth();


  return (
    <div className="h-full w-full bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Welcome, You are logged in as <span className='text-emerald-600 font-semibold'>{user?.role.replace(/([a-z])([A-Z])/g, '$1 $2')}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalBookings}</p>
                <p className="text-xs text-emerald-600">All time bookings</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Active Bookings */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Active Bookings</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.activeBookings}</p>
                <p className="text-xs text-emerald-600">Currently charging</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Available Stations */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Available Stations</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  {stats.availableStations}<span className="text-lg text-emerald-600">/{stats.totalStations}</span>
                </p>
                <p className="text-xs text-emerald-600">Ready for use</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Plug className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">{stats.totalRevenue}</p>
                <p className="text-xs text-emerald-600">This month</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Monthly Growth</p>
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-3xl font-bold text-emerald-600">{stats.monthlyGrowth}</p>
                  <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-xs text-emerald-600">vs last month</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">System Status</p>
                <p className="text-2xl font-bold text-emerald-600 mb-1">Online</p>
                <p className="text-xs text-emerald-600">All systems operational</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                    View all
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/30">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">New booking created</p>
                      <p className="text-sm text-gray-600 mt-0.5">John Doe booked Station A for charging session</p>
                      <p className="text-xs text-gray-500 mt-1.5">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Booking completed</p>
                      <p className="text-sm text-gray-600 mt-0.5">Booking #145 finished charging at Station B</p>
                      <p className="text-xs text-gray-500 mt-1.5">5 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-yellow-500/30">
                      <Plug className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Station maintenance</p>
                      <p className="text-sm text-gray-600 mt-0.5">Station C is offline for scheduled maintenance</p>
                      <p className="text-xs text-gray-500 mt-1.5">15 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/30">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">New user registered</p>
                      <p className="text-sm text-gray-600 mt-0.5">Jane Smith joined the platform</p>
                      <p className="text-xs text-gray-500 mt-1.5">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & System Health */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Create New Booking</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/30">
                    <Plug className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">Manage Stations</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 p-4 text-left hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">View All Users</span>
                </button>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl shadow-sm border border-emerald-200">
              <div className="p-6 border-b border-emerald-200">
                <h2 className="text-xl font-bold text-gray-900">System Health</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">API Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600">Operational</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600">Connected</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
