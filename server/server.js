const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

// ✅ Load environment variables from root .env
dotenv.config({ path: "../.env" });

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Import and use routes
const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);

// ✅ Default route (for testing)
app.get("/", (req, res) => {
  res.send("🔥 Backend is working!");
});

// ✅ MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected...");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
