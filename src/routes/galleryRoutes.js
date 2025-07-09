const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { galleryUpload } = require('../middleware/uploadMiddleware');
const {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryItemById
} = require('../controllers/galleryController');

// Public routes
router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);

// Protected admin routes
router.post('/', [protect, admin, galleryUpload.single('image')], createGalleryItem);
router.put('/:id', [protect, admin, galleryUpload.single('image')], updateGalleryItem);
router.delete('/:id', [protect, admin], deleteGalleryItem);

module.exports = router;
