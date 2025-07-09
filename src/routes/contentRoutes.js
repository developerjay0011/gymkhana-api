const express = require('express');
const router = express.Router();
const {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} = require('../controllers/contentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getContents);
router.get('/:id', getContentById);

// Protected admin routes
router.post('/', [protect, admin], createContent);
router.put('/:id', [protect, admin], updateContent);
router.delete('/:id', [protect, admin], deleteContent);

module.exports = router;
