import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Copy, Eye, Calendar, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react';
import { useBookingContext } from '../../context/BookingContext';
import BookingDetailsModal from './BookingDetailsModal';
import BookingEditModal from './BookingEditModal';

const BookingList = ({ filteredBookings, onExport, onNewBooking }) => {
  const { bookings: allBookings, loading, error } = useBookingContext();
  
  // Use filtered bookings if provided, otherwise use all bookings
  const bookings = filteredBookings || allBookings;

  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5;

  const displayedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return bookings.slice(startIndex, startIndex + itemsPerPage);
  }, [bookings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleBookingAction = (action, bookingId) => {
    const booking = bookings.find(b => (b.id || b._id) === bookingId);
    
    switch (action) {
      case 'view':
        setSelectedBooking(booking);
        setIsDetailsModalOpen(true);
        break;
      case 'edit':
        setSelectedBooking(booking);
        setIsEditModalOpen(true);
        break;
      case 'delete':
        console.log('Delete booking:', bookingId);
        // TODO: Implement delete functionality
        break;
      default:
        console.log(`${action} booking:`, bookingId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Approved':
        return 'bg-teal-50 text-teal-700 border border-teal-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-lg">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage reservations and charging slots</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600">
            <span className="text-gray-900">{bookings.length}</span> 
            {filteredBookings && filteredBookings.length !== allBookings.length 
              ? ` of ${allBookings.length} bookings` 
              : ' Total Bookings'}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={onExport}
              disabled={bookings.length === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={bookings.length === 0 ? 'No data to export' : `Export ${bookings.length} bookings`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button 
              onClick={onNewBooking}
              className="cursor-pointer bg-gradient-to-br from-gray-700 to-gray-800 flex items-center space-x-2 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New Booking</span>
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium">{error}</div>
          </div>
        </div>
      ) : (
        <>
          {/* Table Container */}
          <div className="flex-1 overflow-x-auto bg-white" style={{ minHeight: '300px', maxHeight: '60vh' }}>
            <div className="min-w-[800px]">
              <table className="w-full table-fixed">
              <thead className="bg-gray-50  sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="w-[130px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Booking ID
                  </th>
                  <th className="w-[140px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    EV Owner NIC
                  </th>
                  <th className="w-[120px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Station ID
                  </th>
                  <th className="w-[60px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Slot
                  </th>
                  <th className="w-[110px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                  <th className="w-[110px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Start Time
                  </th>
                  <th className="w-[110px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    End Time
                  </th>
                  <th className="w-[100px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="w-[110px] px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Created At
                  </th>
                  <th className="w-[120px] px-4 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : displayedBookings.length > 0 ? (
                  displayedBookings.map((booking) => {
                    const id = booking.id || booking._id || booking.Id || booking._id?.toString();
                    const evOwnerNic = booking.evOwnerNic || booking.EvOwnerNic || booking.evOwner || '';
                    const stationId = booking.stationId || booking.StationId || booking.station || '';
                    const slotId = booking.slotId ?? booking.SlotId ?? booking.slot ?? '-';
                    const bookingDate = booking.bookingDate || booking.BookingDate || null;
                    const startTime = booking.startTime || booking.StartTime || null;
                    const endTime = booking.endTime || booking.EndTime || null;
                    const status = booking.status || booking.Status || '';
                    const createdAt = booking.createdAt || booking.CreatedAt || booking.created_at || null;
                    const isActive = typeof booking.isActive === 'boolean' ? booking.isActive : booking.IsActive ?? true;

                    const formatDateOnly = (value) => {
                      if (!value) return '-';
                      const d = new Date(value);
                      if (isNaN(d.getTime())) return String(value);
                      return d.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric'
                      });
                    };
                    const formatTime = (value) => {
                      if (!value) return '-';
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

                    return (
                      <tr key={id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-mono text-gray-900 truncate" title={id}>
                              {String(id).slice(0, 12)}...
                            </span>
                            <button 
                              onClick={() => copyToClipboard(String(id))} 
                              className="text-gray-400 hover:text-gray-600 p-0.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                              title="Copy full ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <span className="inline-flex items-center justify-center w-3 h-3 text-xs text-emerald-600 font-medium flex-shrink-0">
                              {copiedId === String(id) && '✓'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 truncate block" title={evOwnerNic}>{evOwnerNic}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-700 truncate block" title={stationId}>
                            {String(stationId).slice(0, 10)}...
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-gray-100 text-xs font-semibold text-gray-900">
                            {slotId}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-700 block truncate">{formatDateOnly(bookingDate)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-700 block truncate">{formatTime(startTime)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-700 block truncate">{formatTime(endTime)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-600">{formatDateOnly(createdAt)}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-0.5">
                            <button
                              onClick={() => handleBookingAction("view", id)}
                              className="cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleBookingAction("edit", id)}
                              className="cursor-pointer p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                              title="Edit Booking"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }).concat(
                    // Add empty rows to maintain consistent table height
                    Array.from({ length: Math.max(0, itemsPerPage - displayedBookings.length) }).map((_, index) => (
                      <tr key={`empty-${index}`} className="h-12">
                        <td colSpan={8} className="px-4 py-3">&nbsp;</td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">No bookings found</p>
                          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>

          {/* Pagination */}
          {!loading && !error && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-700">
                  {bookings.length > 0 ? (
                    <>
                      Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, bookings.length)}</span> of{' '}
                      <span className="font-medium">{bookings.length}</span> results
                    </>
                  ) : (
                    <span className="font-medium">No results to display</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || totalPages <= 1}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(Math.max(totalPages, 1), 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[2rem] px-2 py-1.5 text-sm font-medium rounded transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages <= 1}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Booking Details Modal */}
      <BookingDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />

      {/* Booking Edit Modal */}
      <BookingEditModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
      />
    </div>
  );
};

export default BookingList;