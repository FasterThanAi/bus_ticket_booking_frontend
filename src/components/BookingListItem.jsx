import React from 'react';
import { Link } from 'react-router-dom';

// Helper to format date
const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });

function BookingListItem({ booking, onCancel }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow">
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
        
        <div className="flex gap-2 mt-2">
          <Link
            to={`/ticket/${booking.BookingID}`}
            className="block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            View Ticket
          </Link>
          {booking.Status === 'Confirmed' && (
            <button 
              onClick={() => onCancel(booking.BookingID)}
              className="block px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingListItem;