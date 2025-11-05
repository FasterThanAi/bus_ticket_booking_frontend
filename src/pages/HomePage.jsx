import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- 1. MODIFIED: Import your local image ---
// Make sure you have an 'assets' folder in 'src'
// and your image file is in there.
//
// RENAME 'hero-bus.jpg' to your image's filename
import heroImageUrl from '../assets/screen.png';

// --- 2. MODIFIED: Expanded list of cities ---
const allCities = [
  'Mumbai', 'Pune', 'Delhi', 'Jaipur', 'Bangalore', 'Hyderabad',
  'Patna', 'Lucknow', 'Chennai', 'Kolkata', 'Surat', 'Nagpur',
  'Ahmedabad', 'Indore', 'Bhopal', 'Kochi', 'Goa', 'Chandigarh',
  'Mysore', 'Coimbatore', 'Vijayawada', 'Visakhapatnam', 'Agra',
  'Varanasi', 'Allahabad', 'Kanpur', 'Meerut', 'Udaipur', 'Jodhpur'
];

function HomePage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const sourceRef = useRef(null);
  const destRef = useRef(null);

  const handleSourceChange = (e) => {
    const value = e.target.value;
    setSource(value);
    if (value.length > 0) {
      const filtered = allCities.filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setSourceSuggestions(filtered);
      setShowSourceSuggestions(true);
    } else {
      setShowSourceSuggestions(false);
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 0) {
      const filtered = allCities.filter(city => 
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setDestinationSuggestions(filtered);
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const selectSource = (city) => {
    setSource(city);
    setShowSourceSuggestions(false);
  };

  const selectDestination = (city) => {
    setDestination(city);
    setShowDestSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source || !destination || !date) {
      alert('Please fill all fields');
      return;
    }
    navigate(`/search?from=${source}&to=${destination}&date=${date}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setShowSourceSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target)) {
        setShowDestSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

return (
    // The hero section is now taller, change h-[60vh] to h-[70vh] or as needed
    <div className="relative h-[70vh] -mt-4">
      {/* This <img> tag now uses the imported image variable (NO -z-10) */}
      <img src={heroImageUrl} alt="Bus on a highway" className="absolute inset-0 w-full h-full object-cover" />
      {/* The overlay (NO -z-10) */}
     
      
      {/* This 'relative z-10' correctly puts the text ON TOP of the image/overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white pt-12">
        <h1 className="text-5xl font-bold mb-8 text-shadow-lg"> Online Bus Ticket Booking Site</h1>
        
        <form 
          onSubmit={handleSearch} 
          className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          {/* "From" Input */}
          <div className="relative" ref={sourceRef}>
            <label htmlFor="from" className="block text-sm font-medium text-gray-500 mb-1">From</label>
            <input
              type="text"
              id="from"
              value={source}
              onChange={handleSourceChange}
              onFocus={() => source.length > 0 && setShowSourceSuggestions(true)}
              className="w-full text-lg font-semibold text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2"
              placeholder="Source"
              autoComplete="off"
            />
            {/* Suggestions Dropdown */}
            {showSourceSuggestions && sourceSuggestions.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {sourceSuggestions.map(city => (
                  <li
                    key={city}
                    onClick={() => selectSource(city)}
                    className="p-2 text-gray-900 cursor-pointer hover:bg-gray-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* "To" Input */}
          <div className="relative" ref={destRef}>
            <label htmlFor="to" className="block text-sm font-medium text-gray-500 mb-1">To</label>
            <input
              type="text"
              id="to"
              value={destination}
              onChange={handleDestinationChange}
              onFocus={() => destination.length > 0 && setShowDestSuggestions(true)}
              className="w-full text-lg font-semibold text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2"
              placeholder="Destination"
              autoComplete="off"
            />
            {/* Suggestions Dropdown */}
            {showDestSuggestions && destinationSuggestions.length > 0 && (
              <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                {destinationSuggestions.map(city => (
                  <li
                    key={city}
                    onClick={() => selectDestination(city)}
                    className="p-2 text-gray-900 cursor-pointer hover:bg-gray-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date & Search Button */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-500 mb-1">Date of Journey</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-lg font-semibold text-gray-900 border-b-2 border-gray-300 focus:border-red-500 focus:outline-none p-2"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 transition duration-300 h-full mt-6 py-2"
            >
              Search Buses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HomePage;