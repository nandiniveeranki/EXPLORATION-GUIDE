import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,   // ✅ IMPORTANT FIX
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
    },
    location: {
      lat: Number,
      lon: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("History", searchHistorySchema);
