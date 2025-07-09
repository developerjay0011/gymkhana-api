const { Content } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all content
// @route   GET /api/content
// @access  Public
const getContents = async (req, res) => {
  try {
    const { page, section, type } = req.query;
    console.log('Query params:', { page, section, type });
    
    const query = {};
    if (page) query.page = page;
    if (section) query.section = section;
    if (type) query.type = type;
    
    console.log('Database query:', query);
    
    const contents = await Content.findAll({
      where: query,
      order: [['order', 'ASC']],
      raw: true
    });
    
    console.log('Found contents:', contents);
    
    if (!contents || contents.length === 0) {
      return res.status(404).json({
        message: 'No content found for the given criteria',
        query: { page, section, type }
      });
    }
    
    res.json(contents);
  } catch (error) {
    console.error('Error in getContents:', error);
    res.status(500).json({
      message: 'Failed to fetch content',
      error: error.message
    });
  }
};

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Public
const getContentById = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (content) {
      res.json(content);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create content
// @route   POST /api/content
// @access  Private/Admin
const createContent = async (req, res) => {
  try {
    const createdContent = await Content.create(req.body);
    res.status(201).json(createdContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private/Admin
const updateContent = async (req, res) => {
  try {
    const [updatedCount] = await Content.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updatedCount > 0) {
      const updatedContent = await Content.findByPk(req.params.id);
      res.json(updatedContent);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private/Admin
const deleteContent = async (req, res) => {
  try {
    const deletedCount = await Content.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount > 0) {
      res.json({ message: 'Content removed' });
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};
