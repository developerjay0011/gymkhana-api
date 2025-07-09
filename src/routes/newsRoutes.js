const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { newsUpload } = require('../middleware/uploadMiddleware');
const {
  getNewsItems,
  getNewsItemById,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  getLatestNews
} = require('../controllers/newsController');

// Public routes
router.get('/', getNewsItems);
router.get('/latest', getLatestNews); // Must be before /:id to avoid conflict
router.get('/:id', getNewsItemById);

// Protected admin routes
router.post('/', [protect, admin, newsUpload.single('image')], createNewsItem);
router.put('/:id', [protect, admin, newsUpload.single('image')], updateNewsItem);
router.delete('/:id', [protect, admin], deleteNewsItem);

module.exports = router;
