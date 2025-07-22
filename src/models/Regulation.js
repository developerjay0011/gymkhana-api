const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const RegulationCategory = require('./RegulationCategory');

const Regulation = sequelize.define('Regulation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RegulationCategory,
      key: 'id'
    }
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'regulations',
  timestamps: true
});

// Define associations
Regulation.belongsTo(RegulationCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

module.exports = Regulation;
