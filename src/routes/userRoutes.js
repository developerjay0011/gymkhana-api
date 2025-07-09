const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authUser);

// Protected admin routes
router.post('/register', registerUser);

module.exports = router;
