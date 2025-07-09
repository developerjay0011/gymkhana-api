const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create storage for each type
const createStorage = (type) => {
  const uploadPath = path.join(__dirname, `../../uploads/${type}`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Create multer instances for each type with file size limit
const createUpload = (type) => multer({
  storage: createStorage(type),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create upload instances for each type
const sliderUpload = createUpload('slider');
const newsUpload = createUpload('news');
const eventsUpload = createUpload('events');
const galleryUpload = createUpload('gallery');
const historyUpload = createUpload('history');

// Helper function to get full URL
const getFullUrl = (req, path) => {
  return `${req.protocol}://${req.get('host')}${path}`;
};

module.exports = {
  sliderUpload,
  newsUpload,
  eventsUpload,
  galleryUpload,
  historyUpload,
  getFullUrl
};
