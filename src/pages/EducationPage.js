import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const EducationPage = () => {
  const [language, setLanguage] = useState("en");
  const [crop, setCrop] = useState("All");
  const [materials, setMaterials] = useState([]);

  const fetchContent = async () => {
    let q = collection(db, "education");

    // Dynamic filters
    const filters = [];
    if (language !== "All") filters.push(where("language", "==", language));
    if (crop !== "All") filters.push(where("crop", "==", crop));

    if (filters.length > 0) {
      q = query(q, ...filters);
    }

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => doc.data());
    setMaterials(data);
  };

  useEffect(() => {
    fetchContent();
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎓 Educational Content</h2>

      {/* Language Filter */}
      <label>Language: </label>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="All">All</option>
        <option value="en">English</option>
        <option value="ur">Urdu</option>
      </select>

      {/* Crop Filter */}
      <label style={{ marginLeft: "2rem" }}>Crop: </label>
      <select value={crop} onChange={(e) => setCrop(e.target.value)}>
        <option value="All">All</option>
        <option value="Wheat">Wheat</option>
        <option value="Rice">Rice</option>
        <option value="Maize">Maize</option>
        <option value="Cotton">Cotton</option>
      </select>

      {/* Educational Items */}
      <ul style={{ marginTop: "20px" }}>
        {materials.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "20px" }}>
            <strong>{item.title} ({item.crop})</strong> <br />
            {item.type === "pdf" ? (
              <a href={item.url} target="_blank" rel="noreferrer">📄 View PDF</a>
            ) : (
              <video width="300" controls>
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EducationPage;
