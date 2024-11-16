const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Class = require('./Class');

const Level = sequelize.define('Level', {
  levelNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  levelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requiredXP: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Level;
