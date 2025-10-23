import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../../components/bookings/BookingForm';

const BookingCreatePage = () => {
  return (
    <div className="h-full w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/bookings" className="text-blue-600 hover:text-blue-800 text-decoration-none">
            ← Back to Bookings
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Create New Booking</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create a new charging station booking.
        </p>
      </div>

      <BookingForm />
      
      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Booking Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Minimum booking duration is 30 minutes</li>
          <li>• Maximum booking duration is 8 hours</li>
          <li>• Bookings can be made up to 30 days in advance</li>
          <li>• Cancellations are free up to 2 hours before start time</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default BookingCreatePage;
