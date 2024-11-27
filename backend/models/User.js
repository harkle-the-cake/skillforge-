const { DataTypes } = require('sequelize');
// Richtig
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Azubi',
    validate: {
      isIn: [['Azubi', 'Ausbilder']],
    },
  },
  gold: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'default_avatar.png',
  },
});

module.exports = User;
