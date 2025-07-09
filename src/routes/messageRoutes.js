const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllMessages,
  getMessage,
  createMessage,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/messageController');

// Public route for creating messages
router.post('/', createMessage);

// Protected admin routes
router.get('/', protect, admin, getAllMessages);
router.get('/:id', protect, admin, getMessage);
router.put('/:id/status', protect, admin, updateMessageStatus);
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
