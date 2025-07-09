const { Gallery } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

// Get all gallery items
exports.getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.findAll();
    res.json(items);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = {
      ...req.body,
      imageUrl: getFullUrl(req, `/uploads/gallery/${req.file.filename}`),
      isActive: true
    };

    console.log('Creating gallery item with data:', data);

    const item = await Gallery.create(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    console.log('Update request file:', req.file);
    console.log('Update request body:', req.body);

    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = { ...req.body };

    // Only update imageUrl if a new file was uploaded
    if (req.file) {
      data.imageUrl = getFullUrl(req, `/uploads/gallery/${req.file.filename}`);
    }

    console.log('Updating gallery item with data:', data);

    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    await item.destroy();
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
