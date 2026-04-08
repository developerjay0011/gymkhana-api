const { GalleryFolder, GalleryImage } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

// Get all gallery folders
exports.getGalleryFolders = async (req, res) => {
  try {
    const folders = await GalleryFolder.findAll({
      include: [{
        model: GalleryImage,
        as: 'images',
        order: [['order', 'ASC']]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(folders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get gallery folder by ID with all images
exports.getGalleryFolderById = async (req, res) => {
  try {
    const folder = await GalleryFolder.findByPk(req.params.id, {
      include: [{
        model: GalleryImage,
        as: 'images',
        order: [['order', 'ASC']]
      }]
    });
    if (!folder) {
      return res.status(404).json({ message: 'Gallery folder not found' });
    }
    res.json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create gallery folder
exports.createGalleryFolder = async (req, res) => {
  try {
    const { folderName, title, description } = req.body;

    if (!folderName || !title) {
      return res.status(400).json({ message: 'Folder name and title are required' });
    }

    const data = {
      folderName,
      title,
      description,
      isActive: true
    };

    if (req.file) {
      data.coverImage = getFullUrl(req, `/uploads/gallery/${req.file.filename}`);
    }

    const folder = await GalleryFolder.create(data);
    res.status(201).json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update gallery folder
exports.updateGalleryFolder = async (req, res) => {
  try {
    const folder = await GalleryFolder.findByPk(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Gallery folder not found' });
    }

    const { folderName, title, description, isActive } = req.body;
    const data = { folderName, title, description, isActive };

    if (req.file) {
      data.coverImage = getFullUrl(req, `/uploads/gallery/${req.file.filename}`);
    }

    await folder.update(data);
    res.json(folder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete gallery folder
exports.deleteGalleryFolder = async (req, res) => {
  try {
    const folder = await GalleryFolder.findByPk(req.params.id);
    if (!folder) {
      return res.status(404).json({ message: 'Gallery folder not found' });
    }
    await folder.destroy(); // Associated images will be deleted due to CASCADE
    res.json({ message: 'Gallery folder deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add images to folder
exports.addImagesToFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await GalleryFolder.findByPk(folderId);
    if (!folder) {
      return res.status(404).json({ message: 'Gallery folder not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Get current max order
    const maxOrderImage = await GalleryImage.findOne({
      where: { folder_id: folderId },
      order: [['order', 'DESC']]
    });
    let nextOrder = maxOrderImage ? maxOrderImage.order + 1 : 0;

    const images = req.files.map((file, index) => ({
      imageUrl: getFullUrl(req, `/uploads/gallery/${file.filename}`),
      order: nextOrder + index,
      folder_id: folderId
    }));

    const createdImages = await GalleryImage.bulkCreate(images);
    res.status(201).json(createdImages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove image from folder
exports.removeImageFromFolder = async (req, res) => {
  try {
    const image = await GalleryImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    await image.destroy();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update image order within a folder
exports.updateImageOrder = async (req, res) => {
  try {
    const { imageOrders } = req.body; // Array of { id, order }

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({ message: 'imageOrders must be an array' });
    }

    for (const item of imageOrders) {
      await GalleryImage.update(
        { order: item.order },
        { where: { id: item.id } }
      );
    }

    res.json({ message: 'Image orders updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk delete images
exports.bulkDeleteImages = async (req, res) => {
  try {
    const { imageIds } = req.body; // Array of IDs

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ message: 'imageIds must be a non-empty array' });
    }

    await GalleryImage.destroy({
      where: {
        id: imageIds
      }
    });

    res.json({ message: 'Images deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
