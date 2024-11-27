const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Level = require('./Level');
const User = require('./User');

const Quest = sequelize.define('Quest', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  xpReward: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Standardwert für XP-Belohnung
  },
  goldReward: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Standardwert für Gold-Belohnung
  }
});

module.exports = Quest;