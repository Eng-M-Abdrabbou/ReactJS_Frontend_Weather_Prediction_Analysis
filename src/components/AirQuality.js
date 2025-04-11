import React from 'react';

// Function to interpret AQI value remains the same
const getAqiInterpretation = (aqi) => {
    if (aqi === 1) return { level: 'Good', color: '#27ae60' };
    if (aqi === 2) return { level: 'Fair', color: '#f1c40f' };
    if (aqi === 3) return { level: 'Moderate', color: '#e67e22' };
    if (aqi === 4) return { level: 'Poor', color: '#c0392b' };
    if (aqi === 5) return { level: 'Very Poor', color: '#8e44ad' };
    return { level: 'N/A', color: '#7f8c8d' };
};

function AirQuality({ aqiData }) {
    const isValidAqiData = aqiData && typeof aqiData.main?.aqi === 'number' && typeof aqiData.components === 'object';

    if (!isValidAqiData) {
        console.log("AirQuality component received invalid or null aqiData:", aqiData);
        return (
            <div className="weather-info-card">
                <h3>Air Quality</h3>
                <p style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>
                    Air quality data not available for this location.
                </p>
                 <p style={{textAlign: 'center', fontSize: '0.8em', color: '#aaa', marginTop: '10px'}}>
                    (Data may be temporarily unavailable from the provider.)
                </p>
            </div>
        );
    }

    const aqiValue = aqiData.main.aqi;
    const components = aqiData.components;
    const interpretation = getAqiInterpretation(aqiValue);

    return (
        <div className="weather-info-card">
            <h3>Air Quality Index (AQI)</h3>
            {/* --- UPDATED: AQI Display Area --- */}
            <div className="aqi-display">
                <span className="aqi-value" style={{ color: interpretation.color, borderColor: interpretation.color }}>
                    {aqiValue}
                </span>
                <p className="aqi-level" style={{ color: interpretation.color }}>
                    ({interpretation.level})
                </p>
            </div>

             {/* --- Components Section --- */}
             <h4>Components (μg/m³)</h4>
             <div className="aqi-components-grid">
                 {components && Object.keys(components).length > 0 ? (
                     Object.entries(components).map(([key, value]) => (
                         <p key={key}>
                             <strong>{key.toUpperCase().replace(/_/g, '.').replace('PM25', 'PM2.5')}:</strong>
                             {/* Wrap value in span */}
                             <span>{value?.toFixed(2)}</span>
                         </p>
                     ))
                 ) : (
                     <p style={{ gridColumn: '1 / -1', color: '#888', textAlign:'center' }}>Component data unavailable.</p>
                 )}
             </div>
        </div>
    );
}

export default AirQuality;