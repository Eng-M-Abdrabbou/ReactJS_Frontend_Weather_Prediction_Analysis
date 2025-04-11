import React, { useState } from 'react';
import { useWeatherDispatch, fetchComprehensiveWeatherData } from '../WeatherDataContext'; // Adjust path if needed

function SearchBar() {
  const [city, setCity] = useState('');
  const dispatch = useWeatherDispatch(); // Hook to dispatch actions

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    if (!city.trim()) {
        // Optionally dispatch an error or just return
        console.log("City cannot be empty");
        // dispatch({ type: 'FETCH_ERROR', payload: 'Please enter a city name.' });
        return;
    }
    console.log(`SearchBar: Submitting city: ${city}`);
    // Call the action creator function to fetch data
    fetchComprehensiveWeatherData(dispatch, { city });
    // setCity(''); // Optionally clear input after submit
  };

  return (
    <div className="search-bar-container">
        <form onSubmit={handleSubmit} className="search-bar-form">
        <input
            type="text"
            placeholder="Enter city name (e.g., London, Tokyo)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
        />
        {/* FUTURE: Could add a "Use My Location" button here */}
        <button type="submit">
            Get Weather
        </button>
        </form>
    </div>
  );
}

export default SearchBar;