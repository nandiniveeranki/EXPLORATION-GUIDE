import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import History from "../models/history.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId required" });
    }

    // 1️⃣ Save current message to history
    await History.create({ userId, message });

    // 2️⃣ Fetch last 5 messages
    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3️⃣ Build memory context
    const memory = history
      .map((h) => `- ${h.message}`)
      .reverse()
      .join("\n");

    const context = `
User memory:
${memory}

Current query:
${message}
`;

    // 4️⃣ AI Response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: context }],
        },
      ],
    });

    const reply = result.response.text();

    // 5️⃣ Response
    return res.json({ reply });
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

export default router;
