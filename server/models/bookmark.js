const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  category: String,
  place: String,
  description: String,
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
