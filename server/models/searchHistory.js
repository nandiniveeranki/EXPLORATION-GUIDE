import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  query: { type: String, required: true },
  sources: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('History', HistorySchema);
