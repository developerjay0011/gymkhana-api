const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RegulationCategory = sequelize.define('RegulationCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  subCategories: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('subCategories');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('subCategories', JSON.stringify(value));
    }
  }
}, {
  tableName: 'regulation_categories',
  timestamps: true
});

module.exports = RegulationCategory;
