// models/Class.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Class;
