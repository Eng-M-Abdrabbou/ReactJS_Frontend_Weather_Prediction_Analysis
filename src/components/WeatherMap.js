import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Helper component to center the map when props change
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  // Check if center is valid before setting view
  if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
       map.setView(center, zoom);
  }
  return null;
}


function WeatherMap({ latitude, longitude }) {
  // Ensure coordinates are valid numbers before rendering
  const isValidCoords = typeof latitude === 'number' && typeof longitude === 'number';
  const position = isValidCoords ? [latitude, longitude] : [51.505, -0.09]; // Default fallback (e.g., London)
  const zoomLevel = isValidCoords ? 11 : 5; // Zoom out more if using fallback

  useEffect(() => {
      console.log("WeatherMap receiving coords:", latitude, longitude);
  }, [latitude, longitude]);

  // Don't render the map container if coordinates are invalid/null initially
  if (!isValidCoords) {
      console.log("WeatherMap: Invalid coordinates, not rendering map.");
      return (
          <div className="weather-info-card map-card">
              <h3>Location Map</h3>
              <p style={{textAlign: 'center', marginTop: '50px', color: '#888'}}>Map requires valid location data.</p>
          </div>
      );
  }

  return (
    <div className="weather-info-card map-card">
      {/* <h3>Location Map</h3> */} {/* Title can be optional if card itself implies it */}
      <MapContainer
            className="map-container"
            center={position}
            zoom={zoomLevel}
            scrollWheelZoom={true} // Enable scroll wheel zoom
            style={{ height: "100%", width: "100%", minHeight: '350px' }} // Ensure map fills card
        >
        <ChangeMapView center={position} zoom={zoomLevel} />
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isValidCoords && (
            <Marker position={position}>
            <Popup>
              Approximate Location <br /> Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
            </Popup>
          </Marker>
        )}
        {/* FUTURE: Add layers for Radar, Clouds from OWM Tile Layers if needed */}
      </MapContainer>
    </div>
  );
}

export default WeatherMap;