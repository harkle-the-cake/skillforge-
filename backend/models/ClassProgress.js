const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClassProgress = sequelize.define('ClassProgress', {
  progress: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  currentLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

module.exports = ClassProgress;
