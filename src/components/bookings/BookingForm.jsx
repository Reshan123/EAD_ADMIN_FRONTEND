import React from 'react';

const BookingForm = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create New Booking</h2>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Select User</option>
            <option>John Doe</option>
            <option>Jane Smith</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Station
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Select Station</option>
            <option>Station A</option>
            <option>Station B</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input 
            type="datetime-local" 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input 
            type="datetime-local" 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Booking
          </button>
          <button 
            type="button" 
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;