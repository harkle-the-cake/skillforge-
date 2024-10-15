const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Equipment = sequelize.define('Equipment', {
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gold: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Startet mit 0 Gold
  },
});

module.exports = Equipment;
