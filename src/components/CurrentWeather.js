import React from 'react';

// Helper functions (getIconUrl, formatTime) remain the same as previous response

// Helper to get weather icon URL
const getIconUrl = (iconCode, size = "@2x") => `https://openweathermap.org/img/wn/${iconCode}${size}.png`;

// Helper to format time using timezone offset
const formatTime = (unixTimestamp, timezoneOffsetSeconds) => {
    if (unixTimestamp === null || timezoneOffsetSeconds === null || isNaN(unixTimestamp) || isNaN(timezoneOffsetSeconds) ) return 'N/A';
    const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
    // Use browser's default locale for time formatting
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
};


function CurrentWeather({ current, location }) {
  if (!current || !location || location.latitude === null) {
    return null;
  }

  // Safe access to data
  const weatherDescription = current.weather?.[0]?.description || 'N/A';
  const weatherIcon = current.weather?.[0]?.icon;
  const windSpeed = current.wind?.speed;
  const windDirection = current.wind?.deg;
  const humidity = current.main?.humidity;
  const pressure = current.main?.pressure;
  const visibility = current.visibility;
  const cloudiness = current.clouds?.all;
  const temp = current.main?.temp;
  const feelsLike = current.main?.feelsLike;
  const tempMin = current.main?.tempMin;
  const tempMax = current.main?.tempMax;
  const sunriseTime = formatTime(location.sunrise, location.timezoneOffset);
  const sunsetTime = formatTime(location.sunset, location.timezoneOffset);

  return (
    <div className="weather-info-card current-weather-card">
      <h2>Current Weather in {location.resolvedName || location.searchedCity}</h2>

      {/* --- NEW: Summary Section --- */}
      <div className="current-summary">
          <div className="current-temp-icon">
              {weatherIcon && (
                  <img
                    src={getIconUrl(weatherIcon)}
                    alt={weatherDescription}
                    className="weather-icon"
                  />
              )}
              <p className="temperature">{temp?.toFixed(1)}°C</p>
          </div>
          <div className="current-desc-feels">
              <p className="description">{weatherDescription}</p>
              <p className="feels-like">Feels like: {feelsLike?.toFixed(1)}°C</p>
          </div>
      </div>

      {/* --- Details Grid Section --- */}
      <div className="details-grid">
          {/* Wrap values in <span> for styling */}
          <p><strong>Humidity:</strong> <span>{humidity !== undefined ? `${humidity}%` : 'N/A'}</span></p>
          <p><strong>Wind:</strong> <span>{windSpeed !== undefined ? `${windSpeed.toFixed(1)} m/s` : 'N/A'} {windDirection !== undefined ? `(${windDirection}°)` : ''}</span></p>
          <p><strong>Pressure:</strong> <span>{pressure !== undefined ? `${pressure} hPa` : 'N/A'}</span></p>
          <p><strong>Visibility:</strong> <span>{visibility !== undefined ? `${(visibility / 1000).toFixed(1)} km` : 'N/A'}</span></p>
          <p><strong>Min Temp:</strong> <span>{tempMin?.toFixed(1)}°C</span></p>
          <p><strong>Max Temp:</strong> <span>{tempMax?.toFixed(1)}°C</span></p>
          <p><strong>Cloudiness:</strong> <span>{cloudiness !== undefined ? `${cloudiness}%` : 'N/A'}</span></p>
          <p><strong>Sunrise:</strong> <span>{sunriseTime}</span></p>
          <p><strong>Sunset:</strong> <span>{sunsetTime}</span></p>
      </div>
    </div>
  );
}

export default CurrentWeather;