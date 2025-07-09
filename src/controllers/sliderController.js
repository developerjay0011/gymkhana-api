const { Slider } = require('../models');

// Get all slider items
exports.getSliderItems = async (req, res) => {
  try {
    const items = await Slider.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get slider item by id
exports.getSliderItemById = async (req, res) => {
  try {
    const item = await Slider.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Slider item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFullUrl = (req, path) => {
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}${path}`;
};

// Create slider item
exports.createSliderItem = async (req, res) => {
  try {
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const imagePath = `/uploads/slider/${req.file.filename}`;
    const data = {
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      order: parseInt(req.body.order) || 0,
      imageUrl: getFullUrl(req, imagePath),
      isActive: true
    };

    console.log('Creating slider item with data:', data);

    const item = await Slider.create(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating slider item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update slider item
exports.updateSliderItem = async (req, res) => {
  try {
    console.log('Update request file:', req.file);
    console.log('Update request body:', req.body);

    const item = await Slider.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Slider item not found' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = {
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      order: parseInt(req.body.order) || item.order
    };

    // Only update imageUrl if a new file was uploaded
    if (req.file) {
      const imagePath = `/uploads/slider/${req.file.filename}`;
      data.imageUrl = getFullUrl(req, imagePath);
    }

    console.log('Updating slider item with data:', data);

    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error('Error updating slider item:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete slider item
exports.deleteSliderItem = async (req, res) => {
  try {
    const item = await Slider.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Slider item not found' });
    }
    await item.destroy();
    res.json({ message: 'Slider item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
