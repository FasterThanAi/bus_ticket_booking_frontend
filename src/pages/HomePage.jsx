import React, { useState } from 'react';
import { searchBuses } from '../services/apiService';
import SearchForm from '../components/SearchForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { bookTicket } from '../services/apiService';

function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError('');
    setSearched(true);
    setSearchResults([]);

    try {
      const data = await searchBuses(
        searchParams.source,
        searchParams.destination,
        searchParams.date
      );
      setSearchResults(data);
    } catch (err) {
      setError('No buses found for this route or date. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFIED: Handle Booking ---
  const handleBook = async (scheduleId, availableSeats) => {
    // 1. Check if user is logged in (same as before)
    if (!user) {
      alert('Please log in to book a ticket.');
      navigate('/login');
      return;
    }

    // --- NEW: Ask for number of seats ---
    const numToBookStr = window.prompt('How many seats would you like to book? (Max 6)', '1');
    
    // 2. Validate the input
    if (!numToBookStr) {
      return; // User clicked "Cancel"
    }
    
    const numToBook = parseInt(numToBookStr, 10);

    if (isNaN(numToBook) || numToBook <= 0) {
      alert('Please enter a valid number.');
      return;
    }
    
    if (numToBook > 6) {
      alert('You can book a maximum of 6 tickets at a time.');
      return;
    }

    if (numToBook > availableSeats) {
      alert(`Booking failed: Only ${availableSeats} seats are available.`);
      return;
    }

    // 3. --- NEW: Build the passengers array ---
    // In a real app, you'd show a form to get this.
    // For now, we will create dummy data.
    let passengers = [];
    
    // Add the logged-in user as the first passenger
    passengers.push({
      name: user.name,
      age: 25, // Dummy data
      gender: 'Male', // Dummy data
      seat: `A${Math.floor(Math.random() * 20) + 1}` // Dummy data
    });

    // Add remaining passengers as "Guests"
    for (let i = 1; i < numToBook; i++) {
      passengers.push({
        name: `Guest ${i + 1}`,
        age: 30, // Dummy data
        gender: 'Female', // Dummy data
        seat: `B${Math.floor(Math.random() * 20) + 1}` // Dummy data
      });
    }

    // 4. --- NEW: Create the final bookingData object ---
    const bookingData = {
      userId: user.id,
      scheduleId: scheduleId,
      numOfSeats: numToBook, // Use the number from the prompt
      passengers: passengers // Use the new passenger array
    };

    try {
      // 5. Call the API service (this part is the same)
      const result = await bookTicket(bookingData, token);
      alert(result.Message); 
      
      // 6. Navigate to bookings page (same as before)
      navigate('/bookings'); 

    } catch (err) {
      alert(`Booking Failed: ${err.message}`);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="container max-w-6xl p-8 mx-auto">
      <h1 className="mb-6 text-4xl font-bold text-center">
        Find Your Bus
      </h1>
      
      <SearchForm onSearch={handleSearch} />

      <div className="mt-8">
        {loading && <p className="text-center">Loading buses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Available Buses</h2>
            {searchResults.map(bus => (
              <div key={bus.ScheduleID} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <strong className="text-lg text-blue-700">{bus.BusType}</strong>
                  <p className="text-gray-600">Reg: {bus.RegNumber}</p>
                  <p className="text-sm">Dep: {formatDate(bus.DepartureTime)} | Arr: {formatDate(bus.ArrivalTime)}</p>
                </div>
                <div className="text-right">
                  <strong className="text-xl">₹{bus.Fare}</strong>
                  <p className="text-sm text-gray-500">{bus.AvailableSeats} seats left</p>
                  
                  {/* --- MODIFIED BUTTON: Pass available seats --- */}
                  <button 
                    onClick={() => handleBook(bus.ScheduleID, bus.AvailableSeats)} // <-- Pass available seats
                    disabled={bus.AvailableSeats <= 0}
                    className="px-4 py-1 mt-2 text-sm font-bold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {bus.AvailableSeats <= 0 ? 'Full' : 'Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && searchResults.length === 0 && searched && (
          <p className="text-center text-gray-500">No buses found for this selection.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;