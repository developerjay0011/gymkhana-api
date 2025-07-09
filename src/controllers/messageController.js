const { Message } = require('../models');

// Get all messages with optional status filter
const getAllMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const messages = await Message.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    res.json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ message: 'Error getting messages' });
  }
};

// Get a single message by ID
const getMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error getting message:', error);
    res.status(500).json({ message: 'Error getting message' });
  }
};

// Create a new message (from contact form)
const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = await Message.create({
      name,
      email,
      phone,
      subject,
      message,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Error creating message' });
  }
};

// Update message status
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.status = status;
    await message.save();
    res.json(message);
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Error updating message status' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

module.exports = {
  getAllMessages,
  getMessage,
  createMessage,
  updateMessageStatus,
  deleteMessage,
};
