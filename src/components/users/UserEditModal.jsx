import React, { useState, useEffect, useContext } from 'react';
import { X, User as UserIcon, Mail, Shield, CheckCircle } from 'lucide-react';
import { UserContext } from '../../context/UserContext'; // Adjust path as needed

// Define user roles for the dropdown
const ROLE_OPTIONS = [
  { value: 'BackOffice', label: 'Back Office' },
  { value: 'Admin', label: 'Admin' },
  { value: 'StationOperator', label: 'Station Operator' },
  { value: 'EVOwner', label: 'EV Owner' },
];

const UserEditModal = ({ isOpen, onClose, user }) => {
  const { updateUser, fetchUsers } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);

  // Initialize form data when the user object changes or the modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert('No user selected for editing');
        return;
      }

      if (!formData.name || !formData.email || !formData.role) {
        alert('Please fill in all required fields');
        return;
      }

      const userId = user.id || user._id;
      
      // Prepare update data with keys matching the API request (Name, Email)
      const updateData = {
        Name: formData.name,
        Email: formData.email,
        role: formData.role,
      };

      const result = await updateUser(userId, updateData);
      
      if (result.success) {
        alert('User updated successfully!');
        await fetchUsers(); // Refresh the main user list
        onClose(); // Close modal
      } else {
         throw new Error(result.error?.response?.data?.message || 'Failed to update user');
      }

    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form state on close
    setFormData({ name: '', email: '', role: '' });
    onClose();
  };

  if (!isOpen || !user) return null;

  const userId = user.id || user._id || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-black px-8 pt-8 pb-6">
          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Edit User</h2>
                <p className="text-gray-300 text-sm">Update user profile and role</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* User Info Display */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</label>
                <p className="text-sm font-mono text-gray-900 mt-1">{String(userId)}</p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-900">
                <UserIcon className="w-4 h-4 mr-2 text-black" />
                Full Name <span className="text-black ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-900">
                <Mail className="w-4 h-4 mr-2 text-black" />
                Email Address <span className="text-black ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label htmlFor="role" className="flex items-center text-sm font-semibold text-gray-900">
                <Shield className="w-4 h-4 mr-2 text-black" />
                User Role <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select a role</option>
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Updating...
                  </span>
                ) : (
                  'Update User'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;