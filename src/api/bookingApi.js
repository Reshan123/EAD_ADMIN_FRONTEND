import axiosInstance from './axiosConfig';

export const bookingApi = {
  // Get all bookings
  getAllBookings: () => axiosInstance.get('/bookings'),
  
  // Get booking by ID
  getBookingById: (id) => axiosInstance.get(`/bookings/${id}`),
  
  // Create new booking
  createBooking: (bookingData) => axiosInstance.post('/bookings', bookingData),
  
  // Update booking
  updateBooking: (id, bookingData) => axiosInstance.put(`/bookings/${id}`, bookingData),
  
  // Delete booking
  deleteBooking: (id) => axiosInstance.delete(`/bookings/${id}`),
  
  // Get bookings by user
  getBookingsByUser: (userId) => axiosInstance.get(`/bookings/user/${userId}`),
};