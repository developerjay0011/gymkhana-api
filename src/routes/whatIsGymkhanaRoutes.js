const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getWhatIsGymkhana,
  getAllWhatIsGymkhana,
  createWhatIsGymkhana,
  updateWhatIsGymkhana,
  deleteWhatIsGymkhana
} = require('../controllers/whatIsGymkhanaController');

// Public routes
router.get('/', getWhatIsGymkhana);

// Protected admin routes
router.get('/all', [protect, admin], getAllWhatIsGymkhana);
router.post('/', [protect, admin], createWhatIsGymkhana);
router.put('/:id', [protect, admin], updateWhatIsGymkhana);
router.delete('/:id', [protect, admin], deleteWhatIsGymkhana);

module.exports = router;
