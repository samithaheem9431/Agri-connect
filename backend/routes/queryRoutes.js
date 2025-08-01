const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files, PDFs, and documents are allowed!'));
    }
  }
});

// Agriculture knowledge base
const agricultureKnowledge = {
  crops: {
    "wheat": {
      planting: "Plant wheat in fall (September-October) or spring (March-April). Requires well-drained soil with pH 6.0-7.0.",
      care: "Water regularly, especially during flowering. Apply nitrogen fertilizer in early spring.",
      diseases: "Common diseases include rust, powdery mildew, and fusarium head blight.",
      harvesting: "Harvest when grain moisture is 13-15%. Usually ready 110-130 days after planting."
    },
    "corn": {
      planting: "Plant corn when soil temperature reaches 50°F (10°C). Space seeds 6-8 inches apart.",
      care: "Requires 1-1.5 inches of water per week. Side-dress with nitrogen when plants are 12 inches tall.",
      diseases: "Watch for corn smut, gray leaf spot, and northern corn leaf blight.",
      harvesting: "Harvest when kernels are firm and milk line is 2/3 down the kernel."
    },
    "rice": {
      planting: "Plant rice in flooded fields or well-irrigated soil. Transplant seedlings 20-30 days old.",
      care: "Maintain 2-4 inches of water during growing season. Apply fertilizer at planting and mid-season.",
      diseases: "Common issues include rice blast, bacterial blight, and sheath blight.",
      harvesting: "Harvest when 80-85% of grains are mature and golden yellow."
    },
    "soybeans": {
      planting: "Plant soybeans when soil temperature is 50°F (10°C). Space seeds 1-2 inches apart.",
      care: "Water during flowering and pod development. Avoid over-fertilization.",
      diseases: "Watch for soybean cyst nematode, frogeye leaf spot, and downy mildew.",
      harvesting: "Harvest when 95% of pods are mature and leaves are yellow."
    }
  },
  diseases: {
    "rust": "Rust is a fungal disease causing orange or brown spots on leaves. Control with fungicides and resistant varieties.",
    "blight": "Blight causes rapid wilting and death of plant tissue. Remove infected plants and use disease-free seeds.",
    "mildew": "Powdery mildew appears as white powdery spots. Improve air circulation and apply fungicides.",
    "nematode": "Nematodes are microscopic worms that damage roots. Use crop rotation and resistant varieties."
  },
  soil: {
    "ph": "Most crops prefer pH 6.0-7.0. Test soil annually and adjust with lime (raise pH) or sulfur (lower pH).",
    "nitrogen": "Nitrogen promotes leaf growth. Apply based on soil test results and crop requirements.",
    "phosphorus": "Phosphorus aids root development and flowering. Important for early plant growth.",
    "potassium": "Potassium improves disease resistance and fruit quality. Apply before planting."
  },
  weather: {
    "drought": "During drought, use mulch to retain moisture, irrigate efficiently, and consider drought-resistant varieties.",
    "flooding": "Improve drainage, plant on raised beds, and avoid working wet soil.",
    "frost": "Protect young plants with row covers. Plant after last frost date for your area.",
    "heat": "Provide shade for sensitive crops, increase irrigation, and plant heat-tolerant varieties."
  }
};

// Function to generate AI response based on agriculture knowledge
function generateAgricultureResponse(query, fileType = null) {
  const lowerQuery = query.toLowerCase();
  let response = "";

  // Check for crop-specific queries
  for (const [crop, info] of Object.entries(agricultureKnowledge.crops)) {
    if (lowerQuery.includes(crop)) {
      if (lowerQuery.includes("plant") || lowerQuery.includes("grow")) {
        response += `🌱 **${crop.charAt(0).toUpperCase() + crop.slice(1)} Planting Guide:**\n${info.planting}\n\n`;
      }
      if (lowerQuery.includes("care") || lowerQuery.includes("maintain")) {
        response += `💧 **Care Instructions:**\n${info.care}\n\n`;
      }
      if (lowerQuery.includes("disease") || lowerQuery.includes("problem")) {
        response += `🦠 **Common Diseases:**\n${info.diseases}\n\n`;
      }
      if (lowerQuery.includes("harvest")) {
        response += `🌾 **Harvesting:**\n${info.harvesting}\n\n`;
      }
      if (!response) {
        response += `🌱 **${crop.charAt(0).toUpperCase() + crop.slice(1)} Information:**\n`;
        response += `**Planting:** ${info.planting}\n`;
        response += `**Care:** ${info.care}\n`;
        response += `**Diseases:** ${info.diseases}\n`;
        response += `**Harvesting:** ${info.harvesting}\n\n`;
      }
    }
  }

  // Check for disease queries
  for (const [disease, info] of Object.entries(agricultureKnowledge.diseases)) {
    if (lowerQuery.includes(disease)) {
      response += `🦠 **${disease.charAt(0).toUpperCase() + disease.slice(1)}:**\n${info}\n\n`;
    }
  }

  // Check for soil queries
  for (const [soilType, info] of Object.entries(agricultureKnowledge.soil)) {
    if (lowerQuery.includes(soilType) || lowerQuery.includes("soil")) {
      response += `🌍 **Soil ${soilType.charAt(0).toUpperCase() + soilType.slice(1)}:**\n${info}\n\n`;
    }
  }

  // Check for weather queries
  for (const [weather, info] of Object.entries(agricultureKnowledge.weather)) {
    if (lowerQuery.includes(weather)) {
      response += `🌤️ **${weather.charAt(0).toUpperCase() + weather.slice(1)} Management:**\n${info}\n\n`;
    }
  }

  // File analysis responses
  if (fileType) {
    if (fileType.startsWith('image/')) {
      response += "📸 **Image Analysis:** I can see you've uploaded an image. Based on agricultural best practices:\n";
      response += "• If it's a crop image, I can help identify the plant and provide care instructions\n";
      response += "• If it shows disease symptoms, I can suggest treatment options\n";
      response += "• If it's soil-related, I can provide soil management advice\n\n";
    } else if (fileType === 'application/pdf') {
      response += "📄 **Document Analysis:** I can help analyze your agricultural document. Please ask specific questions about the content.\n\n";
    }
  }

  // General agriculture advice
  if (lowerQuery.includes("fertilizer") || lowerQuery.includes("nutrient")) {
    response += "🌱 **Fertilizer Guidelines:**\n";
    response += "• Test your soil before applying fertilizers\n";
    response += "• Apply nitrogen for leafy growth, phosphorus for roots, potassium for disease resistance\n";
    response += "• Follow recommended rates to avoid over-fertilization\n";
    response += "• Consider organic options like compost and manure\n\n";
  }

  if (lowerQuery.includes("pest") || lowerQuery.includes("insect")) {
    response += "🐛 **Pest Management:**\n";
    response += "• Identify pests correctly before treatment\n";
    response += "• Use integrated pest management (IPM) strategies\n";
    response += "• Consider beneficial insects and natural predators\n";
    response += "• Apply pesticides only when necessary and follow label instructions\n\n";
  }

  if (lowerQuery.includes("irrigation") || lowerQuery.includes("water")) {
    response += "💧 **Irrigation Tips:**\n";
    response += "• Water deeply but infrequently to encourage deep root growth\n";
    response += "• Water early morning to reduce evaporation\n";
    response += "• Use drip irrigation for water efficiency\n";
    response += "• Monitor soil moisture regularly\n\n";
  }

  // If no specific match found, provide general help
  if (!response) {
    response = "🌾 **Agricultural Assistant:** I'm here to help with your farming questions! I can assist with:\n";
    response += "• Crop identification and care instructions\n";
    response += "• Disease diagnosis and treatment\n";
    response += "• Soil management and fertilization\n";
    response += "• Weather-related farming advice\n";
    response += "• Pest and weed management\n";
    response += "• Harvesting and storage tips\n\n";
    response += "Please ask a specific question about your agricultural needs, or upload an image for visual analysis.\n\n";
  }

  return response.trim();
}

// POST /api/query - Handle user queries (text, voice, file)
router.post("/", upload.single('file'), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({ 
        success: false, 
        error: "Text query or file is required" 
      });
    }

    // Generate AI response
    const query = text || "Please analyze this file";
    const fileType = file ? file.mimetype : null;
    const aiResponse = generateAgricultureResponse(query, fileType);

    // Log the interaction
    console.log(`New query: "${query}"${file ? ` with file: ${file.originalname}` : ''}`);
    console.log(`AI Response: ${aiResponse.substring(0, 100)}...`);

    // Clean up uploaded file
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Query processing error:", error);
    
    // Clean up file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      success: false, 
      error: "Failed to process query. Please try again." 
    });
  }
});

// GET /api/query/health - Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Agriculture AI Assistant is running",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
