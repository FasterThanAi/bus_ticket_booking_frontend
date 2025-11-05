import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchBuses } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    if (!from || !to || !date) {
      setError('Missing search parameters.');
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await searchBuses(from, to, date);
        setSearchResults(data);
      } catch (err) {
        setError('No buses found for this route or date.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [from, to, date]);

  // This is the new booking flow
  const handleBook = (scheduleId, availableSeats) => {
    if (!user) {
      alert('Please log in to book a ticket.');
      navigate('/login');
      return;
    }

    const numToBookStr = window.prompt('How many seats would you like to book? (Max 6)', '1');
    if (!numToBookStr) return;
    
    const numToBook = parseInt(numToBookStr, 10);

    if (isNaN(numToBook) || numToBook <= 0 || numToBook > 6) {
      alert('Please enter a valid number between 1 and 6.');
      return;
    }
    if (numToBook > availableSeats) {
      alert(`Booking failed: Only ${availableSeats} seats are available.`);
      return;
    }

    // Navigate to the passenger details page
    navigate(`/book/passengers?scheduleId=${scheduleId}&seats=${numToBook}`);
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-IN', { timeStyle: 'short', dateStyle: 'short' });

  return (
    <div className="container max-w-5xl p-8 mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Buses from {from} to {to}
      </h1>
      <p className="text-lg text-gray-600 mb-6">Showing results for: {date}</p>

      {loading && <p className="text-center">Loading buses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500">No buses found.</p>
          ) : (
            searchResults.map(bus => (
              <div key={bus.ScheduleID} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md border">
                <div className="flex-1 mb-4 md:mb-0">
                  <strong className="text-xl text-blue-800">{bus.BusType}</strong>
                  <p className="text-gray-600">Reg: {bus.RegNumber}</p>
                  <p className="text-sm text-gray-500">
                    Dep: <span className="font-semibold">{formatDate(bus.DepartureTime)}</span> | 
                    Arr: <span className="font-semibold">{formatDate(bus.ArrivalTime)}</span>
                  </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto md:text-right">
                  <strong className="text-2xl font-bold">₹{bus.Fare}</strong>
                  <p className="text-sm text-gray-500">{bus.AvailableSeats} seats left</p>
                  <button 
                    onClick={() => handleBook(bus.ScheduleID, bus.AvailableSeats)}
                    disabled={bus.AvailableSeats <= 0}
                    className="w-full md:w-auto px-6 py-2 mt-2 text-md font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {bus.AvailableSeats <= 0 ? 'Full' : 'Book'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;