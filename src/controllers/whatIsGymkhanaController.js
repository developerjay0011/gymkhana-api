const { WhatIsGymkhana } = require('../models');

// Get active What is Gymkhana content
exports.getWhatIsGymkhana = async (req, res) => {
  try {
    const content = await WhatIsGymkhana.findOne({
      where: { isActive: true },
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Error getting what is gymkhana content:', error);
    res.status(500).json({ message: 'Error getting content' });
  }
};

// Create new What is Gymkhana content
exports.createWhatIsGymkhana = async (req, res) => {
  try {
    const content = await WhatIsGymkhana.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      competitionFormats: req.body.competitionFormats,
      technicalElements: req.body.technicalElements,
      scoringElements: req.body.scoringElements,
    });

    res.status(201).json(content);
  } catch (error) {
    console.error('Error creating what is gymkhana content:', error);
    res.status(500).json({ message: 'Error creating content' });
  }
};

// Update What is Gymkhana content
exports.updateWhatIsGymkhana = async (req, res) => {
  try {
    const [updatedRows] = await WhatIsGymkhana.update({
      title: req.body.title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      competitionFormats: req.body.competitionFormats,
      technicalElements: req.body.technicalElements,
      scoringElements: req.body.scoringElements,
    }, {
      where: { id: req.params.id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const updatedContent = await WhatIsGymkhana.findByPk(req.params.id);
    res.json(updatedContent);
  } catch (error) {
    console.error('Error updating what is gymkhana content:', error);
    res.status(500).json({ message: 'Error updating content' });
  }
};

// Delete What is Gymkhana content
exports.deleteWhatIsGymkhana = async (req, res) => {
  try {
    const deleted = await WhatIsGymkhana.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting what is gymkhana content:', error);
    res.status(500).json({ message: 'Error deleting content' });
  }
};

// Get all What is Gymkhana content (for admin)
exports.getAllWhatIsGymkhana = async (req, res) => {
  try {
    const contents = await WhatIsGymkhana.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(contents);
  } catch (error) {
    console.error('Error getting all what is gymkhana content:', error);
    res.status(500).json({ message: 'Error getting content' });
  }
};
