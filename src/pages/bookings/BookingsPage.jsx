import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  Search,
  Grid3X3,
  List,
  Calendar,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import BookingList from '../../components/bookings/BookingList';
import BookingCard from '../../components/bookings/BookingCard';
import BookingModal from '../../components/bookings/BookingModal';
import { useBookingContext } from '../../context/BookingContext';

const BookingsPage = () => {
  const { bookings, loading, error, fetchBookings } = useBookingContext();
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Get booking properties with fallbacks
      const id = booking.id || booking._id || '';
      const evOwnerNic = booking.evOwnerNic || booking.EvOwnerNic || booking.evOwner || '';
      const stationId = booking.stationId || booking.StationId || booking.station || '';
      const status = booking.status || booking.Status || '';
      const bookingDate = booking.bookingDate || booking.BookingDate || '';

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        String(id).toLowerCase().includes(searchLower) ||
        evOwnerNic.toLowerCase().includes(searchLower) ||
        String(stationId).toLowerCase().includes(searchLower) ||
        status.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = selectedStatus === 'all' || 
        status.toLowerCase() === selectedStatus.toLowerCase();

      // Date filter (compare YYYY-MM-DD)
      const matchesDate = !selectedDate || 
        (bookingDate && new Date(bookingDate).toISOString().slice(0, 10) === selectedDate);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, selectedStatus, selectedDate]);

  // Calculate statistics from real data
  const statistics = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter(b => (b.status || b.Status || '').toLowerCase() === 'active').length;
    const completed = bookings.filter(b => (b.status || b.Status || '').toLowerCase() === 'completed').length;
    const pending = bookings.filter(b => (b.status || b.Status || '').toLowerCase() === 'pending').length;
    const approved = bookings.filter(b => (b.status || b.Status || '').toLowerCase() === 'approved').length;
    const rejected = bookings.filter(b => (b.status || b.Status || '').toLowerCase() === 'rejected').length;

    return { total, active, completed, pending, approved, rejected };
  }, [bookings]);

  // Get unique status values from the data
  const availableStatuses = useMemo(() => {
    const statuses = [...new Set(bookings.map(b => b.status || b.Status || '').filter(Boolean))];
    return statuses.sort();
  }, [bookings]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedDate('');
  };

  // Export filtered bookings to CSV
  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    
    const headers = ['ID', 'EV Owner NIC', 'Station ID', 'Slot', 'Reservation Time', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => {
        const id = booking.id || booking._id || '';
        const evOwnerNic = booking.evOwnerNic || booking.EvOwnerNic || booking.evOwner || '';
        const stationId = booking.stationId || booking.StationId || booking.station || '';
        const slotId = booking.slotId ?? booking.SlotId ?? booking.slot ?? '';
        const reservation = booking.reservationDateTime || booking.ReservationDateTime || booking.reservation || booking.reservationDate || '';
        const status = booking.status || booking.Status || '';
        const createdAt = booking.createdAt || booking.CreatedAt || booking.created_at || '';
        
        return [id, evOwnerNic, stationId, slotId, reservation, status, createdAt].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full overflow-x-hidden bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">


        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage and monitor all charging reservations
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  ) : (
                    statistics.total
                  )}
                </p>
                <p className="text-xs text-gray-500">All reservations</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-gray-700" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl shadow-sm border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Approved</p>
                <p className="text-3xl font-bold text-emerald-600 mb-1">
                  {loading ? (
                    <div className="h-8 bg-emerald-200 rounded animate-pulse w-12"></div>
                  ) : (
                    statistics.approved
                  )}
                </p>
                <p className="text-xs text-emerald-600">Ready to charge</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-500 mb-2">Completed</p>
                <p className="text-3xl font-bold text-blue-500 mb-1">
                  {loading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
                  ) : (
                    statistics.completed
                  )}
                </p>
                <p className="text-xs text-blue-500">Finished sessions</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-6 rounded-2xl shadow-sm border border-yellow-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-700 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mb-1">
                  {loading ? (
                    <div className="h-8 bg-yellow-200 rounded animate-pulse w-12"></div>
                  ) : (
                    statistics.pending
                  )}
                </p>
                <p className="text-xs text-yellow-600">Awaiting approval</p>
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {/* Top row - Search and Clear button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by ID, NIC, Station ID, or Status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-300 rounded-xl transition-all duration-200 whitespace-nowrap hover:shadow-sm"
              >
                Clear Filters
              </button>
            </div>

            {/* Bottom row - Filters and Results counter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[140px]">
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium bg-gray-50 focus:bg-white"
                  >
                    <option value="all">All Status</option>
                    {availableStatuses.map(status => (
                      <option key={status} value={status.toLowerCase()}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="min-w-[140px]">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm font-medium bg-gray-50 focus:bg-white"
                    title="Filter by reservation date"
                  />
                </div>
              </div>

              {/* Results counter */}
              {(searchTerm || selectedStatus !== 'all' || selectedDate) && (
                <div className="text-sm text-gray-600 whitespace-nowrap bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                  Showing <span className="font-semibold text-emerald-600">{filteredBookings.length}</span> of <span className="font-semibold text-gray-900">{bookings.length}</span> bookings
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-w-0 overflow-hidden">
          <BookingList 
            filteredBookings={filteredBookings} 
            onExport={exportToCSV}
            onNewBooking={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default BookingsPage;
