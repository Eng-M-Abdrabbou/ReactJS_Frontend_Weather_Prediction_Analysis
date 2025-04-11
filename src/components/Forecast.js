import React from 'react';

// Reusable Icon URL helper
const getIconUrl = (iconCode, size = "") => `https://openweathermap.org/img/wn/${iconCode}${size}.png`;

// Helper to format date/time considering timezone offset
const formatDateTime = (unixTimestamp, timezoneOffsetSeconds, options) => {
    if (unixTimestamp === null || timezoneOffsetSeconds === null) return 'N/A';
    const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
    return date.toLocaleTimeString([], { timeZone: 'UTC', ...options });
};
const formatDate = (unixTimestamp, timezoneOffsetSeconds, options) => {
    if (unixTimestamp === null || timezoneOffsetSeconds === null) return 'N/A';
    const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
    return date.toLocaleDateString([], { timeZone: 'UTC', ...options });
};


// Groups forecast items by day
const groupForecastByDay = (forecastList, timezoneOffset) => {
    if (!forecastList) return {};

    return forecastList.reduce((acc, item) => {
        const day = formatDate(item.dt, timezoneOffset, { weekday: 'long', month: 'short', day: 'numeric' });
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(item);
        return acc;
    }, {});
};


function Forecast({ forecastList, timezoneOffset }) {
    if (!forecastList || forecastList.length === 0 || timezoneOffset === null) {
        return (
            <div className="weather-info-card forecast-card">
                <h3>5-Day Forecast</h3>
                <p>Forecast data not available.</p>
            </div>
        );
    }

    const groupedForecast = groupForecastByDay(forecastList, timezoneOffset);
    const forecastDays = Object.keys(groupedForecast);

    return (
        <div className="weather-info-card forecast-card">
            <h3>5-Day / 3-Hour Forecast</h3>

            {/* Iterate through each day */}
            {forecastDays.map(day => (
                <div key={day} style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginTop: '10px', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                        {day}
                    </h4>
                    {/* Horizontally scrollable list for the 3-hour intervals of that day */}
                    <div className="forecast-list">
                        {groupedForecast[day].map((item, index) => (
                            <div key={`${day}-${index}`} className="forecast-item">
                                <p className="time">
                                    {formatDateTime(item.dt, timezoneOffset, { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {item.weather?.[0]?.icon && (
                                    <img src={getIconUrl(item.weather[0].icon)} alt={item.weather[0].description} />
                                )}
                                <p className="temp">{item.main?.temp?.toFixed(1)}°C</p>
                                <p style={{ fontSize: '0.85em', textTransform: 'capitalize' }}>{item.weather?.[0]?.description}</p>
                                <p style={{ fontSize: '0.8em', color: '#666' }}>💧 {item.pop !== undefined ? `${Math.round(item.pop * 100)}%` : 'N/A'}</p>
                                <p style={{ fontSize: '0.8em', color: '#666' }}>💨 {item.wind?.speed?.toFixed(1)} m/s</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Forecast;