// models/EndBoss.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Level = require('./Level');

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

Boss.belongsTo(Level); // Ein Level gehört zu einer Klasse

module.exports = Boss;
