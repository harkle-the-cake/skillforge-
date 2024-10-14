// models/EndBoss.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Boss = sequelize.define('Boss', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  weakness: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Boss;
