import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherPage = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const apiKey = "b02a08460bba4568917194623253107";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
      const res = await axios.get(url);
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch failed:", err);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          fetchWeatherByLocation(lat, lon);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationError("Unable to access location.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported by browser.");
      setLoading(false);
    }
  }, []);

  return (
    <>
      <h2>🌍 Weather at Your Location</h2>

      {loading && <p>Fetching weather data...</p>}

      {locationError && <p style={{ color: "red" }}>{locationError}</p>}

      {weather && weather.current && (
        <div className="weather-info">
          <h3>
            {weather.location.name}, {weather.location.region},{" "}
            {weather.location.country}
          </h3>
          <p>🌡 Temperature: {weather.current.temp_c}°C</p>
          <p>💧 Humidity: {weather.current.humidity}%</p>
          <p>🌬 Wind Speed: {weather.current.wind_kph} km/h</p>
          <p>🌥 Condition: {weather.current.condition.text}</p>
        </div>
      )}
    </>
  );
};

export default WeatherPage;
