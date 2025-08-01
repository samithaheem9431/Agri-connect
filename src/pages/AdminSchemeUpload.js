import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AdminSchemeUpload = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eligibility: "",
    province: "Punjab",
    validUntil: "",
    link: ""
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      await addDoc(collection(db, "schemes"), formData);
      alert("✅ Scheme uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        eligibility: "",
        province: "Punjab",
        validUntil: "",
        link: ""
      });
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠 Admin: Upload Government Scheme</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "600px", margin: "auto" }}>
        <input type="text" name="title" placeholder="Scheme Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Scheme Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="eligibility" placeholder="Eligibility Criteria" value={formData.eligibility} onChange={handleChange} required />
        <input type="text" name="province" placeholder="Province" value={formData.province} onChange={handleChange} />
        <input type="text" name="validUntil" placeholder="Valid Until (e.g., 31 Dec 2025)" value={formData.validUntil} onChange={handleChange} />
        <input type="url" name="link" placeholder="More Info / Application Link" value={formData.link} onChange={handleChange} />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Scheme"}
        </button>
      </form>
    </div>
  );
};

export default AdminSchemeUpload;
