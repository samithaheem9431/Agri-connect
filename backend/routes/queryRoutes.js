const express = require("express");
const router = express.Router();

// POST /api/query - Handle user queries (text)
router.post("/", (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Message is required" });
  }

  // You can log, save to Firestore, or trigger notifications here
  console.log(`New query from user ${userId || "Anonymous"}:`, message);

  // Dummy response for now
  res.status(200).json({
    success: true,
    message: "Your query has been received. We'll respond shortly."
  });
});

module.exports = router;
