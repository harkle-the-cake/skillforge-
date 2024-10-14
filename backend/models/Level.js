// models/Level.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Class = require('./Class');
const Boss = require('./Boss');

const Level = sequelize.define('Level', {
  levelNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  levelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requiredXP: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Level.belongsTo(Class); // Ein Level gehört zu einer Klasse
Level.belongsTo(Boss, { foreignKey: 'endBossId', allowNull: true }); // Optionaler Endboss

module.exports = Level;
