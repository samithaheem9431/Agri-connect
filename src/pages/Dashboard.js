import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchWeatherByLocation = async (lat, lon) => {
      try {
        const apiKey = "b02a08460bba4568917194623253107";
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
        const res = await axios.get(url);
        setWeather(res.data);
      } catch (err) {
        console.error("Weather error:", err);
        setWeather(null);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByLocation(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.error(err);
          setLocationError("Unable to detect location.");
        }
      );
    } else {
      setLocationError("Geolocation not supported.");
    }
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">👨‍🌾 Welcome to AgriConnect Dashboard</h1>

      {/* Admin Buttons */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-3 mb-2">
          <button className="btn btn-primary w-100" onClick={() => navigate("/admin/upload-crop")}>
            Add Crop Guide
          </button>
        </div>
        <div className="col-md-3 mb-2">
          <button className="btn btn-success w-100" onClick={() => navigate("/admin/upload-scheme")}>
            Upload Govt Scheme
          </button>
        </div>
      </div>

      {/* Weather Card */}
      {weather && weather.current && (
        <div className="card mb-4 text-center mx-auto" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h5 className="card-title">
              🌤 Weather in {weather.location.name}, {weather.location.region}
            </h5>
            <p className="card-text">{weather.current.condition.text}</p>
            <p className="card-text">
              🌡 {weather.current.temp_c}°C | 💧 {weather.current.humidity}% | 🌬 {weather.current.wind_kph} km/h
            </p>
          </div>
        </div>
      )}

      {locationError && (
        <div className="alert alert-danger text-center" role="alert">
          {locationError}
        </div>
      )}

      {/* Main Navigation Buttons */}
      <div className="row text-center">
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-primary w-100" onClick={() => navigate("/market")}>
            🛒 Marketplace
          </button>
        </div>
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-success w-100" onClick={() => navigate("/crop-guide")}>
            🌾 Crop Guide
          </button>
        </div>
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-warning w-100" onClick={() => navigate("/schemes")}>
            🏛 Govt Schemes
          </button>
        </div>
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-info w-100" onClick={() => navigate("/query")}>
            🧠 Ask Query
          </button>
        </div>
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/education")}>
            🎓 Education
          </button>
        </div>
        <div className="col-6 col-md-4 mb-3">
          <button className="btn btn-outline-danger w-100" onClick={() => navigate("/disease-detect")}>
            🦠 Disease Detection
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center mt-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
