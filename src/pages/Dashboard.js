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
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

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

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="dashboard-title">
                <span className="title-icon">🌾</span>
                AgriConnect Dashboard
              </h1>
              {user && (
                <p className="welcome-text">
                  Welcome back, <strong>{user.email}</strong>
                </p>
              )}
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container main-content">
        {/* Admin Section */}
        <div className="admin-section mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">⚙️</span>
              Administration
            </h2>
            <p className="section-description">Manage crop guides and government schemes</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-4 mb-3">
              <div className="admin-card">
                <button className="btn btn-primary w-100 h-100" onClick={() => navigate("/admin/upload-crop")}>
                  <div className="admin-card-content">
                    <div className="admin-card-icon">📚</div>
                    <h5>Add Crop Guide</h5>
                    <p className="text-light">Upload new crop information and guidelines</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="admin-card">
                <button className="btn btn-success w-100 h-100" onClick={() => navigate("/admin/upload-scheme")}>
                  <div className="admin-card-content">
                    <div className="admin-card-icon">🏛️</div>
                    <h5>Upload Govt Scheme</h5>
                    <p className="text-light">Add new government agricultural schemes</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div className="weather-section mb-5">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🌤️</span>
              Current Weather
            </h2>
          </div>
          {weather && weather.current && (
            <div className="weather-card">
              <div className="weather-content">
                <div className="weather-location">
                  <h4>{weather.location.name}, {weather.location.region}</h4>
                  <p className="weather-condition">{weather.current.condition.text}</p>
                </div>
                <div className="weather-details">
                  <div className="weather-item">
                    <span className="weather-icon">🌡️</span>
                    <span className="weather-value">{weather.current.temp_c}°C</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-icon">💧</span>
                    <span className="weather-value">{weather.current.humidity}%</span>
                  </div>
                  <div className="weather-item">
                    <span className="weather-icon">🌬️</span>
                    <span className="weather-value">{weather.current.wind_kph} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {locationError && (
            <div className="alert alert-warning" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {locationError}
            </div>
          )}
        </div>

        {/* Main Navigation Section */}
        <div className="navigation-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🚀</span>
              Quick Access
            </h2>
            <p className="section-description">Access all AgriConnect features and services</p>
          </div>
          <div className="row">
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-primary w-100 h-100" onClick={() => navigate("/market")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🛒</div>
                    <h5>Marketplace</h5>
                    <p>Buy and sell agricultural products</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-success w-100 h-100" onClick={() => navigate("/crop-guide")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🌾</div>
                    <h5>Crop Guide</h5>
                    <p>Comprehensive crop information</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-warning w-100 h-100" onClick={() => navigate("/schemes")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🏛️</div>
                    <h5>Govt Schemes</h5>
                    <p>Government agricultural schemes</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-info w-100 h-100" onClick={() => navigate("/query")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🧠</div>
                    <h5>Ask Query</h5>
                    <p>Get expert agricultural advice</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-secondary w-100 h-100" onClick={() => navigate("/education")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🎓</div>
                    <h5>Education</h5>
                    <p>Learn modern farming techniques</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="col-6 col-md-4 mb-4">
              <div className="nav-card">
                <button className="btn btn-outline-danger w-100 h-100" onClick={() => navigate("/disease-detect")}>
                  <div className="nav-card-content">
                    <div className="nav-card-icon">🦠</div>
                    <h5>Disease Detection</h5>
                    <p>Identify crop diseases with AI</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
