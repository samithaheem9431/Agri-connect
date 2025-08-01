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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
