import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext'; // Adjust the import path as needed
import { Loader2 } from 'lucide-react';

const UserModal = ({ isOpen, onClose }) => {
  // Access the createUser function and loading state from the context
  const { createUser, usersLoading } = useContext(UserContext);

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BackOffice'); // Default role
  const [formError, setFormError] = useState(null);

  // Clear the form state when the modal is closed and re-opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('BackOffice');
      setFormError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!name || !email || !password || !role) {
      setFormError('All fields are required.');
      return;
    }

    // Construct the user data object to match the API request body
    const userData = {
      Name: name,
      Email: email,
      Password: password,
      role: role,
    };

    const result = await createUser(userData);

    if (result.success) {
      onClose(); // Close the modal on successful creation
    } else {
      // Display an error message if creation fails
      setFormError(result.error?.response?.data?.message || 'Failed to create user. Please try again.');
    }
  };

  return (
    // Modal backdrop and container
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., user@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a secure password"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BackOffice">Back Office</option>
              <option value="StationOperator">Station Operator</option>
            </select>
          </div>

          {/* Error Message Display */}
          {formError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{formError}</p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={usersLoading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={usersLoading}
              className="flex items-center justify-center min-w-[110px] px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {usersLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;