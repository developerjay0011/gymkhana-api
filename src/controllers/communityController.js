const { Community } = require('../models');

// Join Community (Public endpoint)
const joinCommunity = async (req, res) => {
  try {
    const { name, email, instagram } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Clean Instagram handle (strip leading @ if user typed it, or keep clean)
    let cleanInstagram = instagram ? instagram.trim() : null;
    if (cleanInstagram && cleanInstagram.startsWith('@')) {
      cleanInstagram = cleanInstagram.substring(1).trim();
    }

    // Check if email is already registered
    const existing = await Community.findOne({
      where: { email: cleanEmail }
    });

    if (existing) {
      // If already registered, update their name/instagram and re-activate if needed
      if (!existing.isActive) {
        existing.isActive = true;
        existing.name = name.trim();
        if (cleanInstagram) existing.instagram = cleanInstagram;
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your community membership has been reactivated.',
          data: existing
        });
      }

      return res.status(400).json({
        message: 'You have already joined the community with this email address!'
      });
    }

    const newMember = await Community.create({
      name: name.trim(),
      email: cleanEmail,
      instagram: cleanInstagram,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Successfully joined the community!',
      data: newMember,
    });
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ message: error.message || 'Error joining community' });
  }
};

// Get all community members (Admin)
const getAllCommunityMembers = async (req, res) => {
  try {
    const { isActive, search } = req.query;
    const where = {};

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const members = await Community.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching community members:', error);
    res.status(500).json({ message: 'Error fetching community members' });
  }
};

// Get a single community member by ID (Admin)
const getCommunityMemberById = async (req, res) => {
  try {
    const member = await Community.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Community member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error fetching community member:', error);
    res.status(500).json({ message: 'Error fetching community member' });
  }
};

// Update a community member (Admin)
const updateCommunityMember = async (req, res) => {
  try {
    const { name, email, instagram, isActive } = req.body;
    const member = await Community.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Community member not found' });
    }

    if (name !== undefined) member.name = name.trim();
    if (email !== undefined) member.email = email.trim().toLowerCase();
    if (instagram !== undefined) {
      let cleanInsta = instagram ? instagram.trim() : null;
      if (cleanInsta && cleanInsta.startsWith('@')) {
        cleanInsta = cleanInsta.substring(1).trim();
      }
      member.instagram = cleanInsta;
    }
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();
    res.json({
      success: true,
      message: 'Community member updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error updating community member:', error);
    res.status(500).json({ message: 'Error updating community member' });
  }
};

// Delete a community member (Admin)
const deleteCommunityMember = async (req, res) => {
  try {
    const member = await Community.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Community member not found' });
    }
    await member.destroy();
    res.json({ success: true, message: 'Community member deleted successfully' });
  } catch (error) {
    console.error('Error deleting community member:', error);
    res.status(500).json({ message: 'Error deleting community member' });
  }
};

module.exports = {
  joinCommunity,
  getAllCommunityMembers,
  getCommunityMemberById,
  updateCommunityMember,
  deleteCommunityMember,
};
