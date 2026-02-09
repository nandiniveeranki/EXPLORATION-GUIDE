import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import History from "../models/searchHistory.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    console.log("🔥 CHAT API HIT", req.body);

    const { message, userId, lat, lon } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ===============================
    // 🧠 FETCH LAST 5 USER QUERIES
    // ===============================
    let previousChats = "";
    let interestSummary = "No clear interests yet.";

    if (userId) {
      const history = await History.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      previousChats = history
        .reverse()
        .map((h) => `User: ${h.message}`)
        .join("\n");

      // ===============================
      // 🧩 SIMPLE INTEREST DETECTION
      // ===============================
      const combinedText = history
        .map((h) => h.message.toLowerCase())
        .join(" ");

      const interests = [];

      if (combinedText.includes("crop") || combinedText.includes("agriculture")) {
        interests.push("Agriculture");
      }
      if (combinedText.includes("river")) {
        interests.push("Rivers & Water Resources");
      }
      if (combinedText.includes("port")) {
        interests.push("Ports & Coastal Infrastructure");
      }
      if (combinedText.includes("education") || combinedText.includes("college")) {
        interests.push("Education");
      }
      if (combinedText.includes("history")) {
        interests.push("History & Culture");
      }

      if (interests.length > 0) {
        interestSummary = interests.join(", ");
      }
    }

    // ===============================
    // 🤖 AI PROMPT (PERSONALIZED)
    // ===============================
    const prompt = `
You are an AI-powered Exploration Guide for India.

User Location:
Latitude: ${lat ?? "unknown"}
Longitude: ${lon ?? "unknown"}

User Interest Profile:
${interestSummary}

Recent Conversation History:
${previousChats || "No previous history"}

Current Question:
${message}

Instructions:
- Personalize the answer using user's interests
- Use location if relevant
- Suggest 1–2 related domains or topics
- Keep answers clear and practical
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const reply = result.response.text();

    // ===============================
    // 💾 SAVE TO DATABASE
    // ===============================
    await History.create({
      userId: userId || "anonymous",
      message,
      reply,
      location: lat && lon ? { lat, lon } : null,
    });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chatbot error:", err.message);
    res.status(500).json({ error: "AI service unavailable. Try again." });
  }
});

export default router;
