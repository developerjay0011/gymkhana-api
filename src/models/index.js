const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define models
const About = sequelize.define('About', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  whatis: {
    type: DataTypes.STRING(4000),
    allowNull: false,
  },
  characteristics: {
    type: DataTypes.STRING(4000),
    allowNull: true,
  },
  organization: {
    type: DataTypes.STRING(4000),
    allowNull: true,
  },
  coordinator: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  director: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  assistant: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'abouts',
  underscored: true
});

const Contact = sequelize.define('Contact', {
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  socialMedia: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  }
}, { 
  timestamps: false,
});

const Message = sequelize.define('Message', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(DataTypes.MAX),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'new',
    validate: {
      isIn: [['new', 'read', 'replied']],
    },
  },
});

const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Add instance method to compare password
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const WhatIsGymkhana = sequelize.define('WhatIsGymkhana', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  competitionFormats: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  technicalElements: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  scoringElements: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'what_is_gymkhanas',
  underscored: true
});

const Content = sequelize.define('Content', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(DataTypes.MAX),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(DataTypes.MAX),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Gallery = sequelize.define('Gallery', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(DataTypes.MAX),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const History = sequelize.define('History', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'histories',
  underscored: true
});

const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(DataTypes.MAX),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

const Slider = sequelize.define('Slider', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subtitle: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'sliders',
  underscored: true
});

// Model associations can be defined here if needed
// Example: User.hasMany(Message)

// Configure models for MSSQL
const models = [
  About,
  Contact,
  Message,
  User,
  WhatIsGymkhana,
  Content,
  Event,
  Gallery,
  History,
  News,
  Slider
];

// Apply MSSQL-specific configurations to all models
models.forEach(model => {
  // Configure text fields to use NVARCHAR(MAX) instead of TEXT
  Object.keys(model.rawAttributes).forEach(attribute => {
    const attr = model.rawAttributes[attribute];
    if (attr.type instanceof DataTypes.TEXT) {
      attr.type = DataTypes.STRING(DataTypes.MAX);
    }
  });
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    // Note: In production, you might want to use migrations instead
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  About,
  Contact,
  Message,
  News,
  Slider,
  User,
  WhatIsGymkhana,
  History,
  Content,
  Event,
  Gallery
};
