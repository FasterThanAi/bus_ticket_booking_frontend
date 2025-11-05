import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookTicket } from '../services/apiService';

function PassengerDetailsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const scheduleId = searchParams.get('scheduleId');
  const seats = parseInt(searchParams.get('seats'), 10);

  // Create an array of passenger objects
  const initialPassengers = Array(seats).fill().map((_, i) => ({
    name: i === 0 ? user.name : '', // Pre-fill first passenger with user's name
    age: '',
    gender: 'Male',
    seat: `S${i + 1}` // Dummy seat number
  }));

  const [passengers, setPassengers] = useState(initialPassengers);
  const [error, setError] = useState('');

  // Handle changes to any passenger's form
  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    for (const p of passengers) {
      if (!p.name || !p.age || !p.gender) {
        setError('Please fill in all details for all passengers.');
        return;
      }
    }

    const bookingData = {
      userId: user.id,
      scheduleId: parseInt(scheduleId, 10),
      numOfSeats: seats,
      passengers: passengers
    };

    try {
      const result = await bookTicket(bookingData, token);
      alert(result.Message);
      navigate('/bookings');
    } catch (err) {
      alert(`Booking Failed: ${err.message}`);
      setError(err.message);
    }
  };

  // Redirect if params are missing
  useEffect(() => {
    if (isNaN(seats) || !scheduleId) {
      navigate('/');
    }
  }, [seats, scheduleId, navigate]);

  return (
    <div className="container max-w-3xl p-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Passenger Details</h1>
      <p className="text-lg text-gray-700 mb-6">You are booking {seats} seat(s).</p>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border">
        <div className="space-y-8">
          {passengers.map((passenger, index) => (
            <div key={index} className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Passenger {index + 1}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor={`name-${index}`} className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id={`name-${index}`}
                    value={passenger.name}
                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                    required
                    className="w-full text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2"
                  />
                </div>
                {/* Age */}
                <div>
                  <label htmlFor={`age-${index}`} className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    id={`age-${index}`}
                    value={passenger.age}
                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                    required
                    className="w-full text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2"
                  />
                </div>
                {/* Gender */}
                <div>
                  <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    id={`gender-${index}`}
                    value={passenger.gender}
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                    required
                    className="w-full text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {error && <p className="text-red-500 mt-6">{error}</p>}
        
        <button
          type="submit"
          className="w-full mt-8 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 transition duration-300 py-3"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default PassengerDetailsPage;