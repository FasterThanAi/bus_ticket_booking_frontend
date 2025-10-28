import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8080/api';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // Get user and token from context

  // Function to fetch bookings
  const fetchBookings = async () => {
    if (!user) return; // Don't fetch if no user

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/bookings/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // This is crucial for protected routes
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle ticket cancellation
  const handleCancelTicket = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Protected route
        },
        body: JSON.stringify({ bookingId: bookingId })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Cancellation failed');
      }

      alert(result.Message);
      // Refresh the bookings list after cancellation
      fetchBookings();

    } catch (err) {
      alert(err.message);
      console.error('Error cancelling ticket:', err);
    }
  };

  // Run fetchBookings once when the page loads
  useEffect(() => {
    fetchBookings();
  }, [user, token]); // Re-run if user or token changes

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  // --- Render ---
  
  if (loading) {
    return <div className="p-8 text-center">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container max-w-4xl p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.BookingID} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <strong className="text-lg text-blue-700">
                  {booking.Source} to {booking.Destination}
                </strong>
                <p className="text-gray-600">Departure: {formatDate(booking.DepartureTime)}</p>
                <p className="text-sm text-gray-500">Seats: {booking.NumOfSeats} | Total: ₹{booking.TotalAmount}</p>
                <p className="text-sm text-gray-500">Booked on: {formatDate(booking.BookingDate)}</p>
              </div>
              <div className="text-right">
                <strong 
                  className={`font-bold ${
                    booking.Status === 'Cancelled' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {booking.Status}
                </strong>
                {booking.Status === 'Confirmed' && (
                  <button 
                    onClick={() => handleCancelTicket(booking.BookingID)}
                    className="block w-full px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;