const { About } = require('../models');

// Get about content
exports.getAboutContent = async (req, res) => {
  try {
    const about = await About.findOne({
      where: { isActive: true },
    });
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get about by id
exports.getAboutById = async (req, res) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found' });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create about content
exports.createAbout = async (req, res) => {
  try {
    // Validate required fields
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const about = await About.create(req.body);
    res.status(201).json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update about content
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found' });
    }

    // Validate required fields
    const { title, whatis } = req.body;
    if (!title || !whatis) {
      return res.status(400).json({ message: 'Title and What Is sections are required' });
    }

    await about.update(req.body);
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete about content
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found' });
    }
    await about.destroy();
    res.json({ message: 'About content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
