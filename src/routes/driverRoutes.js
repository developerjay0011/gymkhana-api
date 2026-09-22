const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { driverUpload } = require('../middleware/uploadMiddleware');
const {
  registerDriver,
  getAllDrivers,
  getDriverById,
  updateDriverStatus,
  updateDriver,
  deleteDriver,
  getDriverStats,
} = require('../controllers/driverController');

// Helper to allow flexible file upload (profilePhoto, photo, image, etc.) or pure JSON
const uploadDriverPhoto = (req, res, next) => {
  driverUpload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

// Public Driver Registration routes
router.post('/', uploadDriverPhoto, registerDriver);
router.post('/register', uploadDriverPhoto, registerDriver);

// Protected Admin routes
router.get('/stats', protect, admin, getDriverStats);
router.get('/', protect, admin, getAllDrivers);
router.get('/:id', protect, admin, getDriverById);
router.put('/:id/status', protect, admin, updateDriverStatus);
router.put('/:id', protect, admin, uploadDriverPhoto, updateDriver);
router.delete('/:id', protect, admin, deleteDriver);

module.exports = router;
