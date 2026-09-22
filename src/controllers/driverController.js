const { Driver } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');
const { Op } = require('sequelize');

// Helper to parse boolean from YES/NO/true/false
const parseBoolean = (val) => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lower = val.trim().toLowerCase();
    return lower === 'yes' || lower === 'true' || lower === '1';
  }
  return false;
};

// Register a new driver (Public)
const registerDriver = async (req, res) => {
  try {
    const {
      fullName,
      name,
      dateOfBirth,
      dob,
      nationality,
      gender,
      phoneNumber,
      phone,
      email,
      socialMedia,
      instagramFacebookId,
      asnName,
      asnCountry,
      interestedInAagc,
      hasMotorsportHistory,
    } = req.body;

    const resolvedFullName = (fullName || name || '').trim();
    const resolvedDob = (dateOfBirth || dob || '').trim();
    const resolvedNationality = (nationality || '').trim();
    const resolvedGender = (gender || '').trim();
    const resolvedPhone = (phoneNumber || phone || '').trim();
    const resolvedEmail = (email || '').trim().toLowerCase();
    const resolvedSocial = (socialMedia || instagramFacebookId || '').trim();
    const resolvedAsnName = (asnName || '').trim();
    const resolvedAsnCountry = (asnCountry || '').trim();

    // Required fields validation
    if (!resolvedFullName) {
      return res.status(400).json({ message: 'Full name is required' });
    }
    if (!resolvedDob) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }
    if (!resolvedNationality) {
      return res.status(400).json({ message: 'Nationality is required' });
    }
    if (!resolvedGender) {
      return res.status(400).json({ message: 'Gender is required' });
    }
    if (!resolvedPhone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    if (!resolvedEmail) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resolvedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if driver already registered with this email
    const existing = await Driver.findOne({
      where: { email: resolvedEmail }
    });

    if (existing) {
      return res.status(400).json({
        message: 'A driver registration with this email address already exists.'
      });
    }

    // Handle profile photo from file upload or URL passed in body
    let profilePhotoUrl = null;
    if (req.file) {
      profilePhotoUrl = getFullUrl(req, `/uploads/drivers/${req.file.filename}`);
    } else if (req.body.profilePhoto && typeof req.body.profilePhoto === 'string') {
      profilePhotoUrl = req.body.profilePhoto.trim();
    }

    const driver = await Driver.create({
      fullName: resolvedFullName,
      dateOfBirth: resolvedDob,
      nationality: resolvedNationality,
      gender: resolvedGender,
      phoneNumber: resolvedPhone,
      email: resolvedEmail,
      socialMedia: resolvedSocial || null,
      asnName: resolvedAsnName || null,
      asnCountry: resolvedAsnCountry || null,
      interestedInAagc: parseBoolean(interestedInAagc),
      hasMotorsportHistory: parseBoolean(hasMotorsportHistory),
      profilePhoto: profilePhotoUrl,
      status: 'pending',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted successfully!',
      data: driver,
    });
  } catch (error) {
    console.error('Error registering driver:', error);
    res.status(500).json({ message: error.message || 'Error registering driver' });
  }
};

// Get all drivers (Admin)
const getAllDrivers = async (req, res) => {
  try {
    const { status, nationality, asnCountry, search, isActive } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (nationality) {
      where.nationality = nationality;
    }

    if (asnCountry) {
      where.asnCountry = asnCountry;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
        { asnName: { [Op.like]: `%${search}%` } },
      ];
    }

    const drivers = await Driver.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};

// Get a single driver by ID (Admin / Public)
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ message: 'Error fetching driver' });
  }
};

// Update driver status (Admin - approve/reject/pending)
const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, approved, or rejected' });
    }

    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.status = status;
    await driver.save();

    res.json({
      success: true,
      message: `Driver status updated to ${status}`,
      data: driver,
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({ message: 'Error updating driver status' });
  }
};

// Update driver full details (Admin)
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const fields = [
      'fullName',
      'dateOfBirth',
      'nationality',
      'gender',
      'phoneNumber',
      'email',
      'socialMedia',
      'asnName',
      'asnCountry',
      'status',
      'isActive',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        driver[field] = req.body[field];
      }
    });

    if (req.body.interestedInAagc !== undefined) {
      driver.interestedInAagc = parseBoolean(req.body.interestedInAagc);
    }
    if (req.body.hasMotorsportHistory !== undefined) {
      driver.hasMotorsportHistory = parseBoolean(req.body.hasMotorsportHistory);
    }

    if (req.file) {
      driver.profilePhoto = getFullUrl(req, `/uploads/drivers/${req.file.filename}`);
    } else if (req.body.profilePhoto !== undefined) {
      driver.profilePhoto = req.body.profilePhoto;
    }

    await driver.save();

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: driver,
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ message: 'Error updating driver' });
  }
};

// Delete a driver (Admin)
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByPk(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    await driver.destroy();
    res.json({ success: true, message: 'Driver registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Error deleting driver' });
  }
};

// Get registration statistics (Admin)
const getDriverStats = async (req, res) => {
  try {
    const total = await Driver.count();
    const pending = await Driver.count({ where: { status: 'pending' } });
    const approved = await Driver.count({ where: { status: 'approved' } });
    const rejected = await Driver.count({ where: { status: 'rejected' } });

    res.json({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error('Error getting driver statistics:', error);
    res.status(500).json({ message: 'Error getting driver statistics' });
  }
};

module.exports = {
  registerDriver,
  getAllDrivers,
  getDriverById,
  updateDriverStatus,
  updateDriver,
  deleteDriver,
  getDriverStats,
};
