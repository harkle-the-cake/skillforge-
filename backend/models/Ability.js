// models/Ability.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Level = require('./Level');
const EndBoss = require('./EndBoss');

const Ability = sequelize.define('Ability', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Ability.belongsTo(Level); // Fähigkeit gehört zu einem Level
Ability.belongsTo(EndBoss, { foreignKey: 'endBossId', allowNull: true }); // Optional: Fähigkeit gehört zu einem Endboss

module.exports = Ability;
