import React from 'react';
import { X, Calendar, MapPin, Clock, User, Zap, CreditCard, CheckCircle } from 'lucide-react';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  // Extract booking data with fallbacks
  const id = booking.id || booking._id || '';
  const evOwnerNic = booking.evOwnerNic || booking.EvOwnerNic || booking.evOwner || '';
  const stationId = booking.stationId || booking.StationId || booking.station || '';
  const slotId = booking.slotId ?? booking.SlotId ?? booking.slot ?? '-';
  const bookingDate = booking.bookingDate || booking.BookingDate || null;
  const startTime = booking.startTime || booking.StartTime || null;
  const endTime = booking.endTime || booking.EndTime || null;
  const status = booking.status || booking.Status || '';
  const createdAt = booking.createdAt || booking.CreatedAt || booking.created_at || null;
  const updatedAt = booking.updatedAt || booking.UpdatedAt || booking.updated_at || null;

  const formatDate = (value) => {
    if (!value) return 'Not specified';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };
  const formatTime = (value) => {
    if (!value) return 'Not specified';
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    // Always show time in UTC
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gray-900 px-8 pt-8 pb-6">
          <div className="relative flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Booking Details</h2>
                <p className="text-gray-300 text-sm">Complete booking information</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span>{status || 'Unknown'}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-8 space-y-8">
            {/* Booking Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</label>
                  <p className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {String(id).slice(0, 24)}...
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</label>
                  <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">EV Owner NIC</label>
                  <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {evOwnerNic || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Station & Slot Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Station & Slot Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Station ID</label>
                  <p className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {String(stationId).slice(0, 20)}...
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Charging Slot</label>
                  <div className="bg-white px-3 py-2 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Slot {slotId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Reservation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</label>
                  <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {formatDate(bookingDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</label>
                  <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {formatTime(startTime)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</label>
                  <p className="text-sm font-medium text-gray-900 bg-white px-3 py-2 rounded-lg border">
                    {formatTime(endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {updatedAt && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</label>
                    <p className="text-sm text-gray-900 bg-white px-3 py-2 rounded-lg border">
                      {formatDate(updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 text-sm font-semibold"
            >
              Close
            </button>
            <button
              className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-semibold shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
            >
              Edit Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;