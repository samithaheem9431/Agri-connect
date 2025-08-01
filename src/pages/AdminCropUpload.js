import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AdminCropUpload = () => {
  const [formData, setFormData] = useState({
    crop: "",
    region: "Punjab",
    lifecycle: "",
    sowingSeason: "",
    harvestSeason: "",
    soil: "",
    irrigation: "",
    fertilizer: "",
    pesticide: "",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await addDoc(collection(db, "guides"), {
        crop: formData.crop,
        region: formData.region,
        lifecycle: formData.lifecycle,
        sowingSeason: formData.sowingSeason,
        harvestSeason: formData.harvestSeason,
        soil: formData.soil,
        irrigation: formData.irrigation,
        fertilizer: formData.fertilizer,
        pesticide: formData.pesticide,
        imageUrl: formData.imageUrl,
      });

      alert("✅ Crop guide uploaded successfully!");
      setFormData({
        crop: "",
        region: "Punjab",
        lifecycle: "",
        sowingSeason: "",
        harvestSeason: "",
        soil: "",
        irrigation: "",
        fertilizer: "",
        pesticide: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠 Admin: Upload Crop Guide (with Image URL)</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", maxWidth: "600px", margin: "auto" }}>
        <input type="text" name="crop" placeholder="Crop Name" value={formData.crop} onChange={handleChange} required />
        <input type="text" name="region" placeholder="Region" value={formData.region} onChange={handleChange} />
        <textarea name="lifecycle" placeholder="Lifecycle" value={formData.lifecycle} onChange={handleChange} />
        <input type="text" name="sowingSeason" placeholder="Sowing Season" value={formData.sowingSeason} onChange={handleChange} />
        <input type="text" name="harvestSeason" placeholder="Harvest Season" value={formData.harvestSeason} onChange={handleChange} />
        <input type="text" name="soil" placeholder="Soil Type" value={formData.soil} onChange={handleChange} />
        <input type="text" name="irrigation" placeholder="Irrigation" value={formData.irrigation} onChange={handleChange} />
        <input type="text" name="fertilizer" placeholder="Fertilizer" value={formData.fertilizer} onChange={handleChange} />
        <input type="text" name="pesticide" placeholder="Pesticide" value={formData.pesticide} onChange={handleChange} />
        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />

        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "📤 Upload Guide"}
        </button>
      </form>
    </div>
  );
};

export default AdminCropUpload;
