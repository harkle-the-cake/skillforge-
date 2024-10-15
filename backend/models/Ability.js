const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Level = require('./Level'); // Importiere Level

const Ability = sequelize.define('Ability', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Ability;
