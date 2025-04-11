import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

// --- Create Context Objects ---
const WeatherStateContext = createContext(undefined);
const WeatherDispatchContext = createContext(undefined);

// --- UPDATED Initial State ---
const initialState = {
  loading: false,
  error: null,
  location: {
    searchedCity: null,
    resolvedName: null,
    latitude: null,
    longitude: null,
    country: null,
    state: null, // Optional
    timezoneOffset: null, // In seconds from UTC
    sunrise: null, // Moved here from weatherData.current
    sunset: null   // Moved here from weatherData.current
  },
  // UPDATED weatherData structure
  weatherData: {
    current: null,        // Will hold the response from /data/2.5/weather
    forecastList: null, // Will hold the list array from /data/2.5/forecast
    airQuality: null,   // Will hold the first item from /data/2.5/air_pollution list
  },
};

// --- UPDATED Reducer Function ---
function weatherReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      console.log("Reducer: FETCH_START");
      return {
          ...initialState, // Reset most state
          location: { ...initialState.location, searchedCity: action.payload.searchedCity },
          loading: true
        };
    case 'FETCH_SUCCESS':
      console.log("Reducer: FETCH_SUCCESS", action.payload);
       // Payload structure from backend:
       // { locationInfo: { resolvedName, latitude, longitude, country, state, timezoneOffset, sunrise, sunset },
       //   current: { ... OwmCurrentWeatherResponseDto ... },
       //   forecastList: [ ... OwmForecastResponseDto.ForecastItem ... ],
       //   airQuality: { ... OwmAirPollutionResponseDto.AirPollutionData ...} }
      return {
        ...state,
        loading: false,
        error: null,
        location: { // Update location info fully from payload
            ...state.location, // keep searchedCity
            resolvedName: action.payload.locationInfo.resolvedName,
            latitude: action.payload.locationInfo.latitude,
            longitude: action.payload.locationInfo.longitude,
            country: action.payload.locationInfo.country,
            state: action.payload.locationInfo.state,
            timezoneOffset: action.payload.locationInfo.timezoneOffset,
            sunrise: action.payload.locationInfo.sunrise,
            sunset: action.payload.locationInfo.sunset,
        },
        weatherData: { // Store data under new keys
            current: action.payload.current,
            forecastList: action.payload.forecastList,
            airQuality: action.payload.airQuality,
        },
      };
    case 'FETCH_ERROR':
      console.error("Reducer: FETCH_ERROR", action.payload);
      return {
        ...state,
        loading: false,
        error: action.payload,
        weatherData: initialState.weatherData, // Clear weather data on error
      };
     case 'CLEAR_ERROR':
         return { ...state, error: null };
    case 'CLEAR_DATA':
        console.log("Reducer: CLEAR_DATA");
      return initialState; // Reset everything
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// --- Context Provider Component (No changes needed here) ---
export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);
  return (
    <WeatherStateContext.Provider value={state}>
      <WeatherDispatchContext.Provider value={dispatch}>
        {children}
      </WeatherDispatchContext.Provider>
    </WeatherStateContext.Provider>
  );
}

// --- Custom Hooks (No changes needed here) ---
export function useWeatherState() {
  const context = useContext(WeatherStateContext);
  if (context === undefined) {
    throw new Error('useWeatherState must be used within a WeatherProvider');
  }
  return context;
}

export function useWeatherDispatch() {
  const context = useContext(WeatherDispatchContext);
  if (context === undefined) {
    throw new Error('useWeatherDispatch must be used within a WeatherProvider');
  }
  return context;
}

// --- Action Creator Function (API Call Logic) ---
// The backend endpoint is the same, but the structure of response.data is different now.
export async function fetchComprehensiveWeatherData(dispatch, { city, lat, lon }) {
  let params = {};
  let searchedCity = null;
  if (city) {
    params = { city };
    searchedCity = city;
  } else if (lat !== undefined && lon !== undefined) {
    params = { lat, lon };
  } else {
    dispatch({ type: 'FETCH_ERROR', payload: 'Invalid input: City or Coordinates required.' });
    return;
  }

  dispatch({ type: 'FETCH_START', payload: { searchedCity } });

  const API_URL = 'http://localhost:8081/api/weather/location'; // Backend endpoint remains the same

  try {
    console.log(`Fetching from: ${API_URL} with params:`, params);
    const response = await axios.get(API_URL, { params });
    console.log("Backend Response Raw:", response);

    // ** CRITICAL: Validate the NEW expected structure from backend **
    if (!response.data || !response.data.locationInfo || !response.data.current || !response.data.forecastList) {
         console.error("Incomplete data received from backend:", response.data);
         // Check if AQI is optional and handle its absence gracefully
         if (response.data && !response.data.airQuality) {
            console.warn("Air Quality data missing from backend response, proceeding without it.");
         } else {
             throw new Error("Incomplete or invalid core weather data received from the server.");
         }
    }

    // Dispatch success with the payload structured as expected by the reducer
    dispatch({
      type: 'FETCH_SUCCESS',
      payload: {
        locationInfo: response.data.locationInfo, // Pass the whole locationInfo object
        current: response.data.current,           // Pass the whole current weather object
        forecastList: response.data.forecastList, // Pass the forecast list
        airQuality: response.data.airQuality,     // Pass AQI data (might be null)
      },
    });

  } catch (err) {
    console.error("API Fetch Error:", err);
    let errorMessage = 'An unknown error occurred while fetching weather data.';
    if (err.response) {
      console.error("Backend Error Response:", err.response);
      errorMessage = `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText || 'Failed to fetch weather data.'}`;
    } else if (err.request) {
      console.error("Backend No Response:", err.request);
      errorMessage = 'Could not connect to the weather service. Please ensure the backend is running and accessible.';
    } else if (err.message.includes("Network Error")) {
        errorMessage = 'Network Error: Could not connect to the server. Check your internet connection and the backend status.';
    } else {
       errorMessage = err.message || 'An unexpected error occurred.';
    }
    dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
  }
}