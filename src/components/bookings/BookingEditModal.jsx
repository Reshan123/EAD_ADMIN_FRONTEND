import React, { useState, useEffect } from 'react';
import showToast from '../../utils/toastNotification';
import { X, Calendar, MapPin, Clock, Zap, CheckCircle } from 'lucide-react';
import { stationApi } from '../../api/stationApi';
import { bookingApi } from '../../api/bookingApi';
import { useBookingContext } from '../../context/BookingContext';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'Approved', label: 'Approved', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { value: 'Active', label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'Completed', label: 'Completed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
];

const BookingEditModal = ({ isOpen, onClose, booking }) => {
  const { fetchBookings } = useBookingContext();
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    stationId: '',
    slotId: '',
    status: ''
  });
  const [stations, setStations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Initialize form data when booking changes or modal opens
  useEffect(() => {
    if (isOpen && booking) {
      const bookingDate = booking.bookingDate || booking.BookingDate || '';
      const startTime = booking.startTime || booking.StartTime || '';
      const endTime = booking.endTime || booking.EndTime || '';
      const stationId = booking.stationId || booking.StationId || booking.station || '';
      const slotId = booking.slotId ?? booking.SlotId ?? booking.slot ?? '';
      const status = booking.status || booking.Status || '';

      // Format date and time for input fields (always UTC)
      let formattedDate = '';
      let formattedStart = '';
      let formattedEnd = '';
      if (bookingDate) {
        const d = new Date(bookingDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().slice(0, 10); // YYYY-MM-DD
        }
      }
      if (startTime) {
        const d = new Date(startTime);
        if (!isNaN(d.getTime())) {
          formattedStart = d.toISOString().slice(11, 16); // HH:MM
        }
      }
      if (endTime) {
        const d = new Date(endTime);
        if (!isNaN(d.getTime())) {
          formattedEnd = d.toISOString().slice(11, 16); // HH:MM
        }
      }

      setFormData({
        bookingDate: formattedDate,
        startTime: formattedStart,
        endTime: formattedEnd,
        stationId: String(stationId),
        slotId: String(slotId),
        status: status
      });

      fetchStations();
    }
  }, [isOpen, booking]);

  // Fetch slots when station is selected
  useEffect(() => {
    if (formData.stationId && isOpen) {
      fetchSlots(formData.stationId);
    } else {
      setSlots([]);
    }
  }, [formData.stationId, isOpen]);

  const fetchStations = async () => {
    setStationsLoading(true);
    try {
      const response = await stationApi.getAllStations();
      const stationsData = response.data?.data || response.data || [];
      setStations(stationsData);
    } catch (err) {
      console.error('Failed to fetch stations:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load stations';
      showToast('error', `Error loading stations: ${errorMessage}`);
    } finally {
      setStationsLoading(false);
    }
  };

  const fetchSlots = async (stationId) => {
    setSlotsLoading(true);
    try {
      const response = await stationApi.getStationById(stationId);
      const stationData = response.data?.data || response.data || {};
      
      const numberOfSlots = stationData.numberOfSlots || 
                           stationData.slots?.length || 
                           stationData.totalSlots || 
                           4;
      
      const slotsArray = Array.from({ length: numberOfSlots }, (_, index) => ({
        id: index + 1,
        name: `Slot ${index + 1}`,
        available: true
      }));
      
      setSlots(slotsArray);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load slots';
      showToast('error', `Error loading slots: ${errorMessage}`);
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear slot selection when station changes
    if (name === 'stationId') {
      setFormData(prev => ({
        ...prev,
        slotId: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload for booking update
      const payload = {
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        stationId: formData.stationId,
        slotId: formData.slotId,
        status: formData.status
      };

      // Call API to update booking
      const bookingId = booking.id || booking._id;
      await bookingApi.updateBooking(bookingId, payload);

      showToast('success', 'Booking updated successfully!');
      await fetchBookings();
      onClose();
    } catch (err) {
      console.error('BookingEditModal full error object:', err);
      let errorMessage = 'Failed to update booking';
      if (err.response?.data) {
        const data = err.response.data;
        console.log('BookingEditModal error response data:', data);
        // Check for validation errors
        if (data.errors) {
          // Flatten all error messages into a single string, each on a new line
          const errorList = [];
          Object.values(data.errors).forEach(arr => {
            if (Array.isArray(arr)) {
              errorList.push(...arr);
            }
          });
          if (errorList.length > 0) {
            errorMessage = errorList.join('\n');
          }
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
        if (!errorMessage && err.response.status) {
          errorMessage = `Request failed with status code ${err.response.status}`;
        }
      }
      if (!errorMessage && err.message) {
        errorMessage = err.message;
      }
      showToast('error', errorMessage);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      bookingDate: '',
      startTime: '',
      endTime: '',
      stationId: '',
      slotId: '',
      status: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get current datetime for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (!isOpen || !booking) return null;

  // Extract booking details for display
  const bookingId = booking.id || booking._id || '';
  const evOwnerNic = booking.evOwnerNic || booking.EvOwnerNic || booking.evOwner || '';

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
        <div className="relative bg-gray-900 px-8 pt-8 pb-6">
          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Edit Booking</h2>
                <p className="text-gray-300 text-sm">Update reservation details</p>
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
            {/* Booking Info Display */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Information</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</label>
                  <p className="text-sm font-mono text-gray-900 mt-1">{String(bookingId).slice(0, 24)}...</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">EV Owner NIC</label>
                  <p className="text-sm font-medium text-gray-900 mt-1">{evOwnerNic}</p>
                </div>
              </div>
            </div>

            {/* Status Selection - Primary Edit Field */}
            <div className="space-y-2">
              <label htmlFor="status" className="flex items-center text-sm font-semibold text-gray-900">
                <CheckCircle className="w-4 h-4 mr-2 text-black" />
                Booking Status <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select status</option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {/* Status Preview */}
              {formData.status && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    STATUS_OPTIONS.find(opt => opt.value === formData.status)?.color || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {formData.status}
                  </span>
                </div>
              )}
            </div>

            {/* Station Selection */}
            <div className="space-y-2">
              <label htmlFor="stationId" className="flex items-center text-sm font-semibold text-gray-900">
                <MapPin className="w-4 h-4 mr-2 text-black" />
                Charging Station <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="stationId"
                  name="stationId"
                  value={formData.stationId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={stationsLoading}
                >
                  <option value="">
                    {stationsLoading ? 'Loading stations...' : 'Select a station'}
                  </option>
                  {stations.map((station) => (
                    <option key={station.id || station._id} value={station.id || station._id}>
                      {station.name || station.stationName || `Station ${station.id || station._id}`}
                      {station.location && ` - ${station.location}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Slot Selection */}
            <div className="space-y-2">
              <label htmlFor="slotId" className="flex items-center text-sm font-semibold text-gray-900">
                <Zap className="w-4 h-4 mr-2 text-black" />
                Charging Slot <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="slotId"
                  name="slotId"
                  value={formData.slotId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                  disabled={!formData.stationId || slotsLoading}
                >
                  <option value="">
                    {!formData.stationId 
                      ? 'Select a station first' 
                      : slotsLoading 
                        ? 'Loading slots...' 
                        : 'Select a slot'
                    }
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id} disabled={!slot.available}>
                      {slot.name} {!slot.available && '(Unavailable)'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Booking Date */}
            <div className="space-y-2">
              <label htmlFor="bookingDate" className="flex items-center text-sm font-semibold text-gray-900">
                <Calendar className="w-4 h-4 mr-2 text-black" />
                Booking Date <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  value={formData.bookingDate}
                  onChange={handleInputChange}
                  min={getCurrentDateTime().slice(0, 10)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900"
                  required
                />
              </div>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label htmlFor="startTime" className="flex items-center text-sm font-semibold text-gray-900">
                <Clock className="w-4 h-4 mr-2 text-black" />
                Start Time <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900"
                />
              </div>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label htmlFor="endTime" className="flex items-center text-sm font-semibold text-gray-900">
                <Clock className="w-4 h-4 mr-2 text-black" />
                End Time <span className="text-black ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black focus:bg-white transition-all duration-200 text-sm font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 disabled:shadow-none disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Booking'
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
export default BookingEditModal;