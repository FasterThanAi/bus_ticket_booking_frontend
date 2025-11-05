import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchBuses } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import BusListItem from '../components/BusListItem'; // <-- 1. IMPORT

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
    // ... (your existing useEffect fetch logic) ...
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

  const handleBook = (scheduleId, availableSeats) => {
    // ... (your existing handleBook logic) ...
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
    navigate(`/book/passengers?scheduleId=${scheduleId}&seats=${numToBook}`);
  };

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
            // --- 2. UPDATED: Use the new component ---
            searchResults.map(bus => (
              <BusListItem 
                key={bus.ScheduleID} 
                bus={bus} 
                onBook={handleBook} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;