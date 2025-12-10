import express from "express";
import Feedback from "../models/feedback.js";

const router = express.Router();

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

export default router;
