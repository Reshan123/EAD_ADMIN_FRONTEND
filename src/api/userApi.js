import axiosInstance from './axiosConfig';

export const userApi = {
  // Get all users
  getAllUsers: () => axiosInstance.get('/user'),
  
  // Get user by ID
  getUserById: (id) => axiosInstance.get(`/user/${id}`),
  
  // Create new user
  createUser: (userData) => axiosInstance.post('/user', userData),
  
  // Update user
  updateUser: (id, userData) => axiosInstance.put(`/user/${id}`, userData),
  
  // Delete user
  deleteUser: (id) => axiosInstance.delete(`/user/${id}`),
  
  // Login
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  
  // Get current user profile
  getProfile: () => axiosInstance.get('/user/profile'),

  //get all deactive users
  getDeactivatedUsers: () => axiosInstance.get('/EvUser/deactive'),

  // Reactivate user
  reactivateEmployee: (id) => axiosInstance.post(`/EvUser/${id}/reactivate`),
};