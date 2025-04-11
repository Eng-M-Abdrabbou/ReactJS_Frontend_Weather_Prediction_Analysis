import React from 'react';
import { WeatherProvider, useWeatherState } from './WeatherDataContext';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather'; // Needs update internally
import Forecast from './components/Forecast'; // Needs major rewrite
import AirQuality from './components/AirQuality'; // Should be okay
import WeatherMap from './components/WeatherMap'; // Should be okay
// Remove AlertsDisplay and UVIndex imports
import './App.css';

// Leaflet CSS and Icon fix
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function WeatherLayout() {
    // State now includes location.timezoneOffset, location.sunrise, location.sunset
    const { loading, error, weatherData, location } = useWeatherState();

    console.log("WeatherLayout Rendering State:", { loading, error, location, weatherData });

    // Determine if core data is available for rendering
    const hasWeatherData = !loading && !error && weatherData.current && weatherData.forecastList && location.latitude !== null;

    return (
        <div className="App">
            <h1>Weather Forecast and Prediction Dashboard</h1>
            <SearchBar />

            {loading && <p className="loading-indicator">Loading weather data...</p>}
            {error && <p className="error-message">{error}</p>}

            {hasWeatherData && (
                <div className="main-content-area">
                    {/* Pass current weather data and relevant location info */}
                    <CurrentWeather
                        current={weatherData.current}
                        location={location}
                    />

                    {/* Pass coordinates to map */}
                    <WeatherMap
                        latitude={location.latitude}
                        longitude={location.longitude}
                        key={`${location.latitude}-${location.longitude}`} // Force remount on location change
                    />

                    {/* Pass the raw forecast list and timezone offset */}
                    <Forecast
                        forecastList={weatherData.forecastList}
                        timezoneOffset={location.timezoneOffset}
                    />

                    {/* Pass AQI data (might be null) */}
                    <AirQuality aqiData={weatherData.airQuality} />

                    {/* Alerts and UV Index components removed */}

                </div>
            )}

             {/* Initial state message */}
             {!loading && !error && !weatherData.current && (
                 <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>
                     Enter a city name above to get the weather forecast.
                 </p>
             )}
        </div>
    );
}

// App component remains the same
function App() {
  return (
    <WeatherProvider>
       <WeatherLayout />
    </WeatherProvider>
  );
}

export default App;