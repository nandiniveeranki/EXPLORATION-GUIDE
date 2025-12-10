import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./server/routes/auth.js";
import feedbackRoutes from "./server/routes/feedback.js";
import bookmarkRoutes from "./server/routes/bookmark.js";
import chatbotRoutes from "./server/routes/chatbot.js";
import searchHistoryRoutes from "./server/routes/chat.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Debug checks
console.log("🔑 Gemini Key:", process.env.GEMINI_API_KEY ? "Found ✅" : "Missing ❌");
console.log("🔍 Mongo URI:", process.env.MONGO_URI ? "Found ✅" : "Missing ❌");

// MongoDB connection with retry
async function connectDB(retries = 5, delay = 3000) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    if (retries > 0) {
      console.log(`⏳ Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error("❌ Could not connect to MongoDB. Exiting.");
      process.exit(1);
    }
  }
}
connectDB();

// Research API
app.get("/api/research", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "Missing query parameter 'q'." });

  const url =
    `https://api.semanticscholar.org/graph/v1/paper/search?query=` +
    `${encodeURIComponent(q)}&limit=5&fields=title,year,authors,abstract,url`;

  try {
    const upstream = await fetch(url);
    const text = await upstream.text();
    res.status(upstream.status).send(text);
  } catch (err) {
    console.error("Research API Error:", err);
    res.status(500).json({ error: "Failed to fetch research papers." });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/chat", chatbotRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("🌍 AI Powered Exploration Guide Backend is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

