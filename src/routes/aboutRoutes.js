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
const { aboutUpload } = require('../middleware/uploadMiddleware');

const uploadFields = aboutUpload.fields([
  { name: 'coordinator_image', maxCount: 1 },
  { name: 'director_image', maxCount: 1 },
  { name: 'assistant_image', maxCount: 1 },
  { name: 'deputy_director_image', maxCount: 1 }
]);

// Custom middleware to handle Multer errors
const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(400).json({ message: 'Upload error', error: err.message });
    }
    next();
  });
};

// Public routes
router.get('/', getAboutContent);
router.get('/:id', getAboutById);

// Protected routes
// Moving handleUpload to the front to ensure it parses the stream before other middlewares
router.post('/', [handleUpload, protect, admin], createAbout);
router.put('/:id', [handleUpload, protect, admin], updateAbout);
router.delete('/:id', [protect, admin], deleteAbout);

module.exports = router;
