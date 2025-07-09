const { Event } = require('../models');
const { getFullUrl } = require('../middleware/uploadMiddleware');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
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
      imageUrl: getFullUrl(req, `/uploads/events/${req.file.filename}`),
      isActive: true
    };

    console.log('Creating event with data:', data);

    const event = await Event.create(data);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    console.log('Update request file:', req.file);
    console.log('Update request body:', req.body);

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const data = { ...req.body };

    // Only update imageUrl if a new file was uploaded
    if (req.file) {
      data.imageUrl = getFullUrl(req, `/uploads/events/${req.file.filename}`);
    }

    console.log('Updating event with data:', data);

    await event.update(data);
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
