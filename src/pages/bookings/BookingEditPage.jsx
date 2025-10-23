import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../../components/bookings/BookingForm';

const BookingEditPage = () => {
  const mockBooking = {
    id: 1,
    user: 'John Doe',
    station: 'Station A',
    startTime: '2024-10-08T09:00',
    endTime: '2024-10-08T10:00',
    status: 'Active'
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link to="/bookings" className="text-blue-600 hover:text-blue-800 text-decoration-none">
            ← Back to Bookings
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Booking #{mockBooking.id}</h1>
            <p className="text-gray-600 mt-2">
              Update the booking details for {mockBooking.user}.
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            mockBooking.status === 'Active' ? 'bg-green-100 text-green-800' :
            mockBooking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {mockBooking.status}
          </span>
        </div>
      </div>

      {/* Current Booking Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Current Booking Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">User:</span>
            <p className="font-medium">{mockBooking.user}</p>
          </div>
          <div>
            <span className="text-gray-500">Station:</span>
            <p className="font-medium">{mockBooking.station}</p>
          </div>
          <div>
            <span className="text-gray-500">Start Time:</span>
            <p className="font-medium">{new Date(mockBooking.startTime).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">End Time:</span>
            <p className="font-medium">{new Date(mockBooking.endTime).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <BookingForm />
      
      {/* Action Buttons */}
      <div className="mt-8 flex justify-between">
        <div className="space-x-4">
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Cancel Booking
          </button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            Send Notification
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Last modified: 2 hours ago
        </div>
      </div>
      
      {/* Modification Notes */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">Important Notes</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Changes to active bookings will notify the user automatically</li>
          <li>• Time changes may require additional payment or refund</li>
          <li>• Cancelling will initiate the refund process if applicable</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingEditPage;
