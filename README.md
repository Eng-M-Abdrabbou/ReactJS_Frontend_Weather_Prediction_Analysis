# Weather Application Frontend

This repository contains the React frontend for the Weather Application. It provides a user interface to search for weather by city name and displays current conditions, forecast data, air quality information, and a location map fetched from the corresponding backend service.

## Features

*   **City Search:** Input field to search for weather by city name.
*   **Current Weather Display:** Shows temperature, conditions, feels like, humidity, wind, visibility, etc.
*   **Forecast Display:** Presents a 5-day forecast broken down into 3-hour intervals.
*   **Air Quality Index (AQI):** Displays AQI level and pollutant components (if available).
*   **Interactive Map:** Uses Leaflet to show the location on a map.
*   **Responsive Design:** Adapts layout for different screen sizes.
*   **Loading & Error States:** Provides feedback to the user during data fetching and if errors occur.


## Screenshots


### Weather Information
![Weather Info](/Images/WthrInfo.png)

### Map View
![Map](/Images/Map.png)

### Hourly Forecasting
![Hourly Forecasting](/Images/HrForecast.png)

### Air Quality Index
![Air Quality Index](/Images/AQI.png)



## Technologies Used

*   **React 18+** (UI Library)
*   **JavaScript (ES6+)**
*   **CSS3** (Styling, including Flexbox and Grid)
*   **Axios** (For making HTTP requests to the backend)
*   **React Context API** (For global state management)
*   **React Leaflet** (Wrapper for Leaflet.js mapping library)
*   **Leaflet.js** (Core mapping library)
*   **Create React App** (Build toolchain - Webpack, Babel, Dev Server)

## Prerequisites

*   **Node.js and npm (or yarn):** Node.js version 16.x or later recommended. npm is included with Node.js.
*   **Running Backend Service:** The corresponding [Weather Application Backend](<link-to-your-backend-repo>) must be running and accessible (typically on `http://localhost:8081`).

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-frontend-repo-url>
    cd weather-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or if using yarn:
    # yarn install
    ```

## Configuration

The frontend needs to know where the backend API is located. This is configured in:

*   `src/WeatherDataContext.js`

Inside the `fetchComprehensiveWeatherData` function, the `API_URL` constant is set:

```javascript
const API_URL = 'http://localhost:8081/api/weather/location'; // Default backend URL

```

## Running the Application

1.  **Start the Backend:**
    *   Open a terminal in the **`weather-backend`** directory.
    *   Run the Spring Boot application:
        ```bash
        ./mvnw spring-boot:run
        # Or on Windows: mvnw.cmd spring-boot:run
        ```
    *   Wait for the log output indicating the server has started on port 8081.

2.  **Start the Frontend:**
    *   Open a **separate, new** terminal in the **`weather-frontend`** directory.
    *   Run the React development server:
        ```bash
        npm start
        # or: yarn start
        ```
    *   This should automatically open `http://localhost:3000` in your browser.

Now you can use the application in your browser. The frontend (on port 3000) will make requests to the backend (on port 8081).

## API Key Security Note

For demonstration purposes, the API key is placed in `application.properties`. **In a production environment, never commit API keys directly into your code repository.** Use environment variables, Spring Cloud Config, or a dedicated secrets management service.    

## Project structure:

### `weather-frontend/`

This directory contains the React frontend application responsible for:

* Providing the user interface for interacting with the weather application.
* Making API calls to the backend to fetch weather data.
* Displaying the weather information to the user.

    * **`.gitignore`**: Specifies files that Git should ignore in this frontend project.
    * **`README.md`**: A README file specific to the frontend, potentially containing instructions on running the frontend development server.
    * **`package.json`**: Contains metadata about the frontend application, including dependencies and scripts for development, building, and testing.
    * **`package-lock.json`**: Records the exact versions of dependencies used in the frontend.
    * **`node_modules/`**: Contains the installed Node..js packages (dependencies) for the frontend. This directory is usually not committed to Git.
    * **`public/`**: Contains static assets served directly by the frontend, such as the main HTML file (`index.html`), images, and other public resources.
    * **`src/`**: Contains the main source code for the React frontend.
        * **`App.js`**: The root component of the React application, responsible for setting up the main layout and routing (if any).
        * **`App.css`**: Global CSS styles for the application.
        * **`index.js`**: The entry point that renders the `App` component into the DOM.
        * **`index.css`**: Global CSS styles applied to the `index.js` file.
        * **`WeatherDataContext.js`**: Implements the React Context API to manage and share weather-related state (data, loading status, errors) across different components.
        * **`components/`**: Contains reusable UI components used throughout the application.
            * **`AirQuality.js`**: Component to display air quality information (e.g., pollutants, AQI).
            * **`CurrentWeather.js`**: Component to display the current weather conditions (temperature, humidity, wind, etc.).
            * **`Forecast.js`**: Component to display the weather forecast for the coming days or hours.
            * **`SearchBar.js`**: Component that provides an input field for users to enter a location to search for.
            * **`WeatherMap.js`**: Component that likely displays a map with weather-related overlays (if this feature is implemented).
        * **`... (other source files)`**: May include utility functions, custom hooks, or additional components.

### Root `README.md`

This file (the one you are currently reading the description of) provides a high-level overview of the entire full-stack project, including both the backend and frontend components, and instructions on how to set up and run the application.



## Future Improvements

*   Add unit/integration tests for components.
*   Implement more sophisticated charting for forecast trends.
*   Allow selection of units (Celsius/Fahrenheit).
*   Add a "Use My Location" feature using browser geolocation.
*   Refactor CSS (e.g., using CSS Modules or a UI library).
