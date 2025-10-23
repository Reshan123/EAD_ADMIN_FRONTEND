import React from 'react';

const BookingCard = ({ booking }) => {
  const mockBooking = booking || {
    id: 1,
    user: 'John Doe',
    station: 'Station A',
    startTime: '2024-10-08 09:00',
    endTime: '2024-10-08 10:00',
    status: 'Active',
    duration: '1 hour',
    cost: '$15.00'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Booking #{mockBooking.id}
          </h3>
          <p className="text-gray-600">User: {mockBooking.user}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          mockBooking.status === 'Active' ? 'bg-green-100 text-green-800' :
          mockBooking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {mockBooking.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Station:</span>
          <span className="font-medium">{mockBooking.station}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Start:</span>
          <span className="font-medium">{mockBooking.startTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">End:</span>
          <span className="font-medium">{mockBooking.endTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Duration:</span>
          <span className="font-medium">{mockBooking.duration}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cost:</span>
          <span className="font-medium text-green-600">{mockBooking.cost}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
          View Details
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 text-sm">
          Edit
        </button>
      </div>
    </div>
  );
};

export default BookingCard;