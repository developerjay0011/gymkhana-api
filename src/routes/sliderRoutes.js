const express = require('express');
const router = express.Router();
const {
  getSliderItems,
  getSliderItemById,
  createSliderItem,
  updateSliderItem,
  deleteSliderItem,
} = require('../controllers/sliderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { sliderUpload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getSliderItems);
router.get('/:id', getSliderItemById);

// Protected admin routes
router.post('/', [protect, admin, sliderUpload.single('image')], createSliderItem);
router.put('/:id', [protect, admin, sliderUpload.single('image')], updateSliderItem);
router.delete('/:id', [protect, admin], deleteSliderItem);

module.exports = router;
