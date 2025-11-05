import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookingDetails } from '../services/apiService';

function TicketPage() {
  const { bookingId } = useParams();
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId && token) {
      setLoading(true);
      getBookingDetails(bookingId, token)
        .then(data => {
          setBooking(data.details);
          setPassengers(data.passengers);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [bookingId, token]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  if (loading) return <div className="p-8 text-center">Loading ticket...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!booking) return <div className="p-8 text-center">No ticket found.</div>;

  return (
    <div className="container max-w-3xl p-8 mx-auto">
      {/* --- 1. UPDATED PRINT BUTTON --- */}
      <button 
        onClick={handlePrint} 
        className="w-full py-2 mb-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 print:hidden"
      >
        {booking.Status === 'Cancelled' ? 'Print (Cancelled Ticket)' : 'Print Ticket'}
      </button>

      {/* --- 2. ADDED 'relative' FOR WATERMARK --- */}
      <div className="printable-ticket relative p-8 bg-white border-4 border-dashed border-gray-300 rounded-lg overflow-hidden">
        
        {/* --- 3. NEW: CANCELLED WATERMARK --- */}
        {/* This will only appear if the status is 'Cancelled' */}
        {booking.Status === 'Cancelled' && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <span className="text-9xl font-bold text-red-100 -rotate-45 opacity-70 select-none">
              CANCELLED
            </span>
          </div>
        )}

        {/* --- 4. All content is now relative and above the watermark --- */}
        <div className="relative z-10">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h1 className="text-3xl font-bold text-blue-800">BusBooking</h1>
              
              {/* --- 5. DYNAMIC STATUS TEXT --- */}
              {booking.Status === 'Confirmed' ? (
                <p className="text-green-600 font-semibold">Your ticket is confirmed.</p>
              ) : (
                <p className="text-red-600 font-bold text-lg">This ticket is CANCELLED.</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Booking ID:</p>
              <p className="font-mono text-lg">{booking.BookingID}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 py-6 border-b">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-2xl font-bold">{booking.Source}</p>
              <p className="text-sm font-semibold text-gray-700">{formatDate(booking.DepartureTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">To</p>
              <p className="text-2xl font-bold">{booking.Destination}</p>
              <p className="text-sm font-semibold text-gray-700">{formatDate(booking.ArrivalTime)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 py-6 border-b">
            <div>
              <p className="text-sm text-gray-500">Bus Type</p>
              <p className="text-lg font-semibold">{booking.BusType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration #</p>
              <p className="text-lg font-semibold">{booking.RegNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Fare</p>
              <p className="text-lg font-semibold">₹{booking.TotalAmount}</p>
            </div>
          </div>

          <div className="py-6">
            <h2 className="mb-4 text-xl font-bold">Passenger Details ({passengers.length} Seat(s))</h2>
            <table className="w-full">
              <thead className="text-left bg-gray-100">
                <tr>
                  <th className="p-2 text-sm font-semibold text-gray-600">Name</th>
                  <th className="p-2 text-sm font-semibold text-gray-600">Age</th>
                  <th className="p-2 text-sm font-semibold text-gray-600">Gender</th>
                  <th className="p-2 text-sm font-semibold text-gray-600">Seat</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{p.Name}</td>
                    <td className="p-2">{p.Age}</td>
                    <td className="p-2">{p.Gender}</td>
                    <td className="p-2">{p.SeatNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* End of relative content wrapper */}

      </div>
    </div>
  );
}

export default TicketPage;