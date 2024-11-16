const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Level = require('./Level'); // Importiere das Level-Modell

const Boss = sequelize.define('Boss', {
  name: {
    type: DataTypes.STRING,
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

module.exports = Boss;
