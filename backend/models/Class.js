const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define('Class', {
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
  },
});

module.exports = Class;
