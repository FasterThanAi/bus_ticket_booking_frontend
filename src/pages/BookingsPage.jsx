import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBookings, cancelTicket } from '../services/apiService'; // <-- Uses your API service
import { Link } from 'react-router-dom'; // <-- Imports Link for the button

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  // Function to fetch bookings
  const fetchBookings = useCallback(async () => { // <-- Uses useCallback
    if (!user) return;
    setLoading(true);
    try {
      // Use the service
      const data = await getMyBookings(user.id, token);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, token]); // <-- Dependencies for useCallback

  // Function to handle ticket cancellation
  const handleCancelTicket = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      // Use the service
      const result = await cancelTicket(bookingId, token);
      alert(result.Message);
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert(err.message);
      console.error('Error cancelling ticket:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); // <-- Use the callback function

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
  
  if (loading) return <div className="p-8 text-center">Loading your bookings...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container max-w-4xl p-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.BookingID} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <strong className="text-lg text-blue-700">
                  {booking.Source} to {booking.Destination}
                </strong>
                <p className="text-gray-600">Departure: {formatDate(booking.DepartureTime)}</p>
                <p className="text-sm text-gray-500">Seats: {booking.NumOfSeats} | Total: ₹{booking.TotalAmount}</p>
                <p className="text-sm text-gray-500">Booked on: {formatDate(booking.BookingDate)}</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <strong 
                  className={`font-bold ${
                    booking.Status === 'Cancelled' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {booking.Status}
                </strong>
                
                {/* --- UPDATED BUTTONS --- */}
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/ticket/${booking.BookingID}`}
                    className="block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    View Ticket
                  </Link>
                  {booking.Status === 'Confirmed' && (
                    <button 
                      onClick={() => handleCancelTicket(booking.BookingID)}
                      className="block px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;