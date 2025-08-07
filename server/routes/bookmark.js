const express = require('express');
const router = express.Router();
const Bookmark = require('../models/bookmark');

router.post('/', async (req, res) => {
  const { userId, category, place, description } = req.body;
  try {
    const newBookmark = new Bookmark({ userId, category, place, description });
    await newBookmark.save();
    res.status(201).json({ message: 'Bookmark saved' });
  } catch {
    res.status(500).json({ error: 'Error saving bookmark' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId });
    res.json(bookmarks);
  } catch {
    res.status(500).json({ error: 'Could not fetch bookmarks' });
  }
});

module.exports = router;
