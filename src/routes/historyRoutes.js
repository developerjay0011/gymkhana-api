const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { historyUpload } = require('../middleware/uploadMiddleware');
const {
  getHistoryItems,
  getHistoryItemById,
  createHistoryItem,
  updateHistoryItem,
  deleteHistoryItem
} = require('../controllers/historyController');

// Public routes
router.get('/', getHistoryItems);
router.get('/:id', getHistoryItemById);

// Protected admin routes
router.post('/', [protect, admin, historyUpload.single('image')], createHistoryItem);
router.put('/:id', [protect, admin, historyUpload.single('image')], updateHistoryItem);
router.delete('/:id', [protect, admin], deleteHistoryItem);

module.exports = router;
