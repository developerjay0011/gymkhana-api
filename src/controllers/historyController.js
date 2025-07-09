const { History } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

// Get all history items
exports.getHistoryItems = async (req, res) => {
  try {
    const items = await History.findAll({
      where: { isActive: true },
      order: [['year', 'DESC'], ['order', 'ASC']],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get history item by id
exports.getHistoryItemById = async (req, res) => {
  try {
    const item = await History.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'History item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create history item
exports.createHistoryItem = async (req, res) => {
  try {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    if (!req.body.title || !req.body.description || !req.body.year) {
      return res.status(400).json({ message: 'Title, description, and year are required' });
    }

    const data = {
      ...req.body,
      year: parseInt(req.body.year),
      order: parseInt(req.body.order || '0'),
      imageUrl: req.file ? getFullUrl(req, `/uploads/history/${req.file.filename}`) : null,
      isActive: true
    };

    console.log('Creating history item with data:', data);

    const item = await History.create(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating history item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update history item
exports.updateHistoryItem = async (req, res) => {
  try {
    console.log('Update request file:', req.file);
    console.log('Update request body:', req.body);

    const item = await History.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'History item not found' });
    }

    const data = {
      ...req.body,
      year: parseInt(req.body.year),
      order: parseInt(req.body.order || '0')
    };

    if (req.file) {
      data.imageUrl = getFullUrl(req, `/uploads/history/${req.file.filename}`);
    }

    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error('Error updating history item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete history item
exports.deleteHistoryItem = async (req, res) => {
  try {
    const item = await History.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'History item not found' });
    }
    await item.destroy();
    res.json({ message: 'History item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
