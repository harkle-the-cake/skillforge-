const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Stelle sicher, dass Class und Boss korrekt importiert werden
const Class = require('./Class');
const Boss = require('./Boss');
const Ability = require('./Ability');


// Definiere das Level-Modell
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Assoziationen
Level.belongsTo(Class); // Ein Level gehört zu einer Klasse
Level.belongsTo(Boss, { foreignKey: 'endBossId', allowNull: true }); // Optionaler Endboss
Level.hasMany(Ability, { foreignKey: 'LevelId', onDelete: 'CASCADE' }); // Eine Klasse hat viele Levels

module.exports = Level;
