const express = require('express');
const router = express.Router();
const {
  getAboutContent,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout
} = require('../controllers/aboutController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAboutContent);
router.get('/:id', getAboutById);

// Protected routes
router.post('/', [protect, admin], createAbout);
router.put('/:id', [protect, admin], updateAbout);
router.delete('/:id', [protect, admin], deleteAbout);

module.exports = router;
