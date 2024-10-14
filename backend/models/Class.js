const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definiere das Class-Modell
const Class = sequelize.define('Class', {
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Assoziationen (Levels und Users)
const Level = require('./Level'); // Falls Level existiert
const User = require('./User'); // Falls User existiert

Class.hasMany(Level, { foreignKey: 'ClassId', onDelete: 'CASCADE' }); // Eine Klasse hat viele Levels
Class.belongsToMany(User, { through: 'UserClasses' }); // N:N Beziehung zu User

module.exports = Class;
