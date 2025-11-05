import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelTicket } from '../services/apiService';
import BookingListItem from '../components/BookingListItem'; // <-- 1. IMPORT

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchBookings = useCallback(async () => {
    // ... (your existing fetchBookings logic) ...
    if (!user) return;
    setLoading(true);
    try {
      const data = await getMyBookings(user.id, token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const handleCancelTicket = async (bookingId) => {
    // ... (your existing handleCancelTicket logic) ...
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      const result = await cancelTicket(bookingId, token);
      alert(result.Message);
      fetchBookings();
    } catch (err) {
      alert(err.message);
      console.error('Error cancelling ticket:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  
  if (loading) return <div className="p-8 text-center">Loading your bookings...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container max-w-4xl p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        <div className="space-y-4">
          {/* --- 2. UPDATED: Use the new component --- */}
          {bookings.map(booking => (
            <BookingListItem 
              key={booking.BookingID}
              booking={booking}
              onCancel={handleCancelTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;