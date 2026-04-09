const { About } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

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
    console.log('Create About - Body:', req.body);
    console.log('Create About - Files:', req.files);

    // Validate required fields (handle both 'whatis' and 'content' for compatibility)
    const title = req.body.title;
    const whatis = req.body.whatis || req.body.content;

    if (!title || !whatis) {
      return res.status(400).json({ 
        message: 'Title and content (whatis) are required',
        received: { title, whatis }
      });
    }

    const data = { ...req.body, whatis }; // Ensure whatis is populated

    // Handle images
    if (req.files) {
      const imageFields = ['coordinator_image', 'director_image', 'assistant_image', 'deputy_director_image'];
      imageFields.forEach(field => {
        if (req.files[field] && req.files[field][0]) {
          const imagePath = `/uploads/about/${req.files[field][0].filename}`;
          data[field] = getFullUrl(req, imagePath);
        }
      });
    }

    const about = await About.create(data);
    res.status(201).json(about);
  } catch (error) {
    console.error('Error in createAbout:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update about content
exports.updateAbout = async (req, res) => {
  try {
    console.log('--- Update About Debug ---');
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body:', req.body);
    console.log('Files:', req.files ? Object.keys(req.files) : 'None');
    console.log('ID:', req.params.id);

    const about = await About.findByPk(req.params.id);
    if (!about) {
      return res.status(404).json({ message: 'About content not found' });
    }

    // Validate required fields (handle both 'whatis' and 'content' for compatibility)
    const title = req.body.title;
    const whatis = req.body.whatis || req.body.content;

    if (!title || !whatis) {
      return res.status(400).json({ 
        message: 'Title and What Is sections are required',
        received: { 
          hasTitle: !!title, 
          hasWhatis: !!req.body.whatis, 
          hasContent: !!req.body.content,
          bodyKeys: Object.keys(req.body)
        }
      });
    }

    const data = { ...req.body, whatis }; // Ensure whatis is populated

    // Handle images
    if (req.files) {
      const imageFields = ['coordinator_image', 'director_image', 'assistant_image', 'deputy_director_image'];
      imageFields.forEach(field => {
        if (req.files[field] && req.files[field][0]) {
          const imagePath = `/uploads/about/${req.files[field][0].filename}`;
          data[field] = getFullUrl(req, imagePath);
        }
      });
    }

    await about.update(data);
    res.json(about);
  } catch (error) {
    console.error('Error in updateAbout:', error);
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
