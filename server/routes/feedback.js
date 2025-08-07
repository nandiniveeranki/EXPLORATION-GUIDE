const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

router.post("/", async (req, res) => {
  const { userId, email, feedbackText } = req.body;

  try {
    const fb = new Feedback({ userId, email, feedbackText });
    await fb.save();
    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "Error submitting feedback" });
  }
});

module.exports = router;
