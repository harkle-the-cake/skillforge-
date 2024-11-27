const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Quest = require('./Quest');

const QuestProgress = sequelize.define('QuestProgress', {
  status: {
    type: DataTypes.STRING,
    defaultValue: 'open', // Standardstatus, wenn ein Azubi eine Quest annimmt
  },
  xpEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // XP, die der Azubi für die Quest erhält
  },
  goldEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Gold, das der Azubi für die Quest erhält
  },
});

module.exports = QuestProgress;