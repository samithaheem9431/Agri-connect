import React, { useState } from "react";
import { uploadImageAndSaveData } from "../firebase";

const DiseaseDetectPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDiagnose = async () => {
    if (!image) return alert("Please upload an image.");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/diagnose", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      await uploadImageAndSaveData(image, data);
    } catch (error) {
      console.error(error);
      alert("Diagnosis failed.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>🦠 Plant Disease Detection</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: 300 }} />}
      <button onClick={handleDiagnose} disabled={loading || !image}>
        {loading ? "Analyzing..." : "Diagnose"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Pesticide:</strong> {result.pesticide}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetectPage;
