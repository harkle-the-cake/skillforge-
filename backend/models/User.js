const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ROLES = {
  AZUBI: 'Azubi',
  AUSBILDER: 'Ausbilder',
};

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ROLES.AZUBI,
      validate: {
        isIn: [[ROLES.AZUBI, ROLES.AUSBILDER]], // Validierung mit den konstanten Werten
      },
  },
  gold: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Startet mit 0 Gold
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'default_avatar.png'
  }
});

// Assoziationen (Falls noch nicht vorhanden)
const Class = require('./Class'); // Falls 'Class' existiert

User.belongsToMany(Class, { through: 'UserClasses' }); // N:N Beziehung zu Classes


module.exports = User;
