import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import WeatherPage from "./pages/WeatherPage";
import SignupPage from "./pages/SignupPage";
import MarketplacePage from "./pages/MarketplacePage";
import CropGuidePage from "./pages/CropGuidePage";
import SchemesPage from "./pages/SchemesPage";
import QueryPortalPage from "./pages/QueryPortalPage";
import EducationPage from "./pages/EducationPage";
import DiseaseDetectPage from "./pages/DiseaseDetectPage";
import AdminCropUpload from "./pages/AdminCropUpload";
import AdminSchemeUpload from "./pages/AdminSchemeUpload";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/market" element={<MarketplacePage />} />
      <Route path="/crop-guide" element={<CropGuidePage />} />
      <Route path="/schemes" element={<SchemesPage />} />
      <Route path="/query" element={<QueryPortalPage />} />
      <Route path="/disease-detect" element={<DiseaseDetectPage />} />
      <Route path="/education" element={<EducationPage />} />
      <Route path="/admin/upload-crop" element={<AdminCropUpload />} />
      <Route path="/admin/upload-scheme" element={<AdminSchemeUpload />} />

    </Routes>
  );
};

export default App;
