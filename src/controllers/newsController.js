const { News } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

// Get all news items
exports.getNewsItems = async (req, res) => {
  try {
    const items = await News.findAll({
      where: { isActive: true },
      order: [['date', 'DESC']],
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest news items
exports.getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const items = await News.findAll({
      where: { isActive: true },
      order: [['date', 'DESC']],
      limit: limit,
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get news item by id
exports.getNewsItemById = async (req, res) => {
  try {
    const item = await News.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all news
exports.getNews = async (req, res) => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create news item
exports.createNewsItem = async (req, res) => {
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
      imageUrl: getFullUrl(req, `/uploads/news/${req.file.filename}`),
      isActive: true
    };

    console.log('Creating news with data:', data);

    const item = await News.create(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update news item
exports.updateNewsItem = async (req, res) => {
  try {
    console.log('Update request file:', req.file);
    console.log('Update request body:', req.body);

    const item = await News.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'News item not found' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = { ...req.body };

    // Only update imageUrl if a new file was uploaded
    if (req.file) {
      data.imageUrl = getFullUrl(req, `/uploads/news/${req.file.filename}`);
    }

    console.log('Updating news with data:', data);

    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete news item
exports.deleteNewsItem = async (req, res) => {
  try {
    const item = await News.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'News item not found' });
    }
    await item.destroy();
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
