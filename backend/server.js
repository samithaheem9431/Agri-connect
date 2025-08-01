const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const queryRoutes = require("./routes/queryRoutes");

app.use("/api/query", queryRoutes);

// Health check route
app.get("/", (req, res) => res.send("🌾 AgriConnect API is running successfully!"));


app.post("/api/query", async (req, res) => {
  try {
    const flaskResponse = await axios.post("http://localhost:5000/api/query", req.body);
    res.json(flaskResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
