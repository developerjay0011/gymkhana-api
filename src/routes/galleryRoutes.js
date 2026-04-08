const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { galleryUpload } = require('../middleware/uploadMiddleware');
const {
  getGalleryFolders,
  getGalleryFolderById,
  createGalleryFolder,
  updateGalleryFolder,
  deleteGalleryFolder,
  addImagesToFolder,
  removeImageFromFolder,
  updateImageOrder,
  bulkDeleteImages
} = require('../controllers/galleryController');

// Public routes
router.get('/', getGalleryFolders);
router.get('/:id', getGalleryFolderById);

// Protected admin routes
router.post('/', [protect, admin, galleryUpload.single('image')], createGalleryFolder);
router.put('/:id', [protect, admin, galleryUpload.single('image')], updateGalleryFolder);
router.delete('/:id', [protect, admin], deleteGalleryFolder);

// Image management routes
router.post('/:folderId/images', [protect, admin, galleryUpload.array('images', 20)], addImagesToFolder);
router.delete('/images/:id', [protect, admin], removeImageFromFolder);
router.delete('/images/delete/bulk', [protect, admin], bulkDeleteImages);
router.put('/images/order', [protect, admin], updateImageOrder);

module.exports = router;
