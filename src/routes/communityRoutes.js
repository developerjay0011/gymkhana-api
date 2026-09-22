const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  joinCommunity,
  getAllCommunityMembers,
  getCommunityMemberById,
  updateCommunityMember,
  deleteCommunityMember,
} = require('../controllers/communityController');

// Public route for joining the community (supports POST / and POST /join)
router.post('/', joinCommunity);
router.post('/join', joinCommunity);

// Protected admin routes
router.get('/', protect, admin, getAllCommunityMembers);
router.get('/:id', protect, admin, getCommunityMemberById);
router.put('/:id', protect, admin, updateCommunityMember);
router.delete('/:id', protect, admin, deleteCommunityMember);

module.exports = router;
