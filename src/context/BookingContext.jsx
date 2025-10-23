import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';

export const BookingContext = createContext();

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getAllBookings();
      // Expecting response.data to be an array of bookings
      setBookings(response.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Could not fetch bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Simple wrappers for create/update/delete to keep local state in sync
  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingApi.createBooking(bookingData);
      setBookings((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking.');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBooking = useCallback(async (bookingId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingApi.updateBooking(bookingId, updateData);
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? response.data : b)));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Failed to update booking:', err);
      setError('Failed to update booking.');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBooking = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      await bookingApi.deleteBooking(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError('Failed to delete booking.');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingById = useCallback((bookingId) => {
    return bookings.find((booking) => booking.id === parseInt(bookingId));
  }, [bookings]);

  const value = {
    bookings,
    loading,
    error,
    selectedBooking,
    setSelectedBooking,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
    getBookingById,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};