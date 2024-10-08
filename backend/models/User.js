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
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'default_avatar.png'
  }
});


// Funktion, die eine Transaktion um eine Aktion herum erstellt
const createUserWithTransaction = async (userData) => {
  const transaction = await sequelize.transaction();  // Transaktion starten

  try {
    const newUser = await User.create(userData, { transaction });  // Operation mit Transaktion
    await transaction.commit();  // Commit der Transaktion
    return newUser;
  } catch (error) {
    await transaction.rollback();  // Rollback der Transaktion bei Fehler
    throw error;
  }
};

// Beispiel für das Löschen aller Benutzer mit Transaktion
const deleteAllUsersWithTransaction = async () => {
  const transaction = await sequelize.transaction();  // Transaktion starten

  try {
    await User.destroy({ where: {}, transaction });  // Alle Benutzer mit Transaktion löschen
    await transaction.commit();  // Commit der Transaktion
  } catch (error) {
    await transaction.rollback();  // Rollback bei Fehler
    throw error;
  }
};

module.exports = User;
