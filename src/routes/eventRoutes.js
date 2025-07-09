const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { eventsUpload } = require('../middleware/uploadMiddleware');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById
} = require('../controllers/eventController');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected admin routes
router.post('/', [protect, admin, eventsUpload.single('image')], createEvent);
router.put('/:id', [protect, admin, eventsUpload.single('image')], updateEvent);
router.delete('/:id', [protect, admin], deleteEvent);

module.exports = router;
