import { useBookingContext } from '../context/BookingContext';

export const useBookings = () => {
  return useBookingContext();
};