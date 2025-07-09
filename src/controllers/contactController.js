const { Contact } = require('../models');

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single contact
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create contact
const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update contact
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.update(req.body);
      res.json(contact);
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete contact
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.destroy();
      res.json({ message: 'Contact deleted' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
