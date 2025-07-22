const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const RegulationCategory = require('../models/RegulationCategory');
const Regulation = require('../models/Regulation');
const { regulationsUpload, getFullUrl } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/categories', async (req, res) => {
  try {
    const categories = await RegulationCategory.findAll({
      order: [['order', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/regulations', async (req, res) => {
  try {
    const regulations = await Regulation.findAll({
      where: { isActive: true },
      include: [{
        model: RegulationCategory,
        as: 'category'
      }],
      order: [['order', 'ASC']]
    });
    res.json(regulations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (Admin only)
// Categories
router.post('/categories', protect, async (req, res) => {
  try {
    const category = await RegulationCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/categories/:id', protect, async (req, res) => {
  try {
    const [updated] = await RegulationCategory.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const category = await RegulationCategory.findByPk(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/categories/:id', protect, async (req, res) => {
  try {
    const deleted = await RegulationCategory.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    // Delete all regulations in this category
    await Regulation.destroy({
      where: { categoryId: req.params.id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Regulations
router.post('/regulations', protect, regulationsUpload.single('document'), async (req, res) => {
  try {
    const regulation = await Regulation.create({
      ...req.body,
      documentUrl: req.file ? `/uploads/regulations/${req.file.filename}` : req.body.documentUrl
    });
    res.status(201).json(regulation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/regulations/:id', protect, regulationsUpload.single('document'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.documentUrl = `/uploads/regulations/${req.file.filename}`;
    }
    
    const [updated] = await Regulation.update(updateData, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).json({ message: 'Regulation not found' });
    }
    const regulation = await Regulation.findByPk(req.params.id, {
      include: [{
        model: RegulationCategory,
        as: 'category'
      }]
    });
    res.json(regulation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/regulations/:id', protect, async (req, res) => {
  try {
    const deleted = await Regulation.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Regulation not found' });
    }
    res.json({ message: 'Regulation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
