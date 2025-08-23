const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getStats, updateStats } = require('../controllers/championshipStatsController');

// Public: fetch stats
router.get('/', getStats);

// Admin: update stats
router.put('/', protect, admin, updateStats);

module.exports = router;
