const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// Public routes
router.get('/', getAllContacts);
router.get('/:id', getContact);

// Protected routes (admin only)
router.post('/', protect, admin, createContact);
router.put('/:id', protect, admin, updateContact);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
