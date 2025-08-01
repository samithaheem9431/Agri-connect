import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const CropGuidePage = () => {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");

  const loadGuides = async () => {
    try {
      const snapshot = await getDocs(collection(db, "guides"));
      const items = snapshot.docs.map((doc) => doc.data());
      setGuides(items);
    } catch (err) {
      console.error("Error loading crop guides:", err);
      setError("Failed to load crop guide data.");
    }
  };

  useEffect(() => {
    loadGuides();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🌾 Crop Lifecycle Guides</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {guides.length === 0 ? (
        <p>No crop guides available.</p>
      ) : (
        guides.map((guide, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.5rem",
              textAlign: "left",
              backgroundColor: "#f9f9f9"
            }}
          >
            <h3>🌿 {guide.crop} ({guide.region})</h3>
            <p><strong>Lifecycle:</strong> {guide.lifecycle}</p>
            <p><strong>Sowing Season:</strong> {guide.sowingSeason}</p>
            <p><strong>Harvest Season:</strong> {guide.harvestSeason}</p>
            <p><strong>Soil:</strong> {guide.soil}</p>
            <p><strong>Irrigation:</strong> {guide.irrigation}</p>
            <p><strong>Fertilizer:</strong> {guide.fertilizer}</p>
            <p><strong>Pesticide:</strong> {guide.pesticide}</p>
            {guide.imageUrl && (
              <img
                src={guide.imageUrl}
                alt={guide.crop}
                style={{ maxWidth: "300px", marginTop: "1rem", borderRadius: "8px" }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CropGuidePage;
