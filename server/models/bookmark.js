import mongoose from "mongoose";

const BookmarkSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // 🔥 allow any string for now
  category: { type: String, required: true },
  place: String,
  description: String,
});

const Bookmark = mongoose.model("Bookmark", BookmarkSchema);
export default Bookmark;
