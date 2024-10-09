const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Class = sequelize.define('Class', {
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1, // Startet bei Level 1
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Startet mit 0 XP
  },
});

// Beziehung: Ein Benutzer hat mehrere Klassen
User.hasMany(Class, { as: 'classes', foreignKey: 'userId' });
Class.belongsTo(User, { foreignKey: 'userId' });

module.exports = Class;
