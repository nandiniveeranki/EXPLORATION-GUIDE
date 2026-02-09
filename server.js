import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Existing routes (only real files)
import authRoutes from "./server/routes/auth.js";
import feedbackRoutes from "./server/routes/feedback.js";
import chatbotRoutes from "./server/routes/chatbot.js";

dotenv.config();
const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= Debug checks =================
console.log("🔑 Gemini Key:", process.env.GEMINI_API_KEY ? "Found ✅" : "Missing ❌");
console.log("🔍 Mongo URI:", process.env.MONGO_URI ? "Found ✅" : "Missing ❌");

// ================= MongoDB Connection =================
async function connectDB(retries = 5, delay = 3000) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    if (retries > 0) {
      console.log(`⏳ Retrying in ${delay / 1000}s... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error("❌ MongoDB connection failed. Exiting.");
      process.exit(1);
    }
  }
}
connectDB();

// ================= Research Paper API =================
app.get("/api/research", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }

  const url =
    `https://api.semanticscholar.org/graph/v1/paper/search?query=` +
    `${encodeURIComponent(q)}&limit=5&fields=title,year,authors,abstract,url`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (err) {
    console.error("❌ Research API Error:", err);
    res.status(500).json({ error: "Failed to fetch research papers" });
  }
});

// ================= API Routes =================
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatbotRoutes);

// ================= Default Route =================
app.get("/", (req, res) => {
  res.send("🌍 AI Powered Exploration Guide Backend is running...");
});

// ================= Start Server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
