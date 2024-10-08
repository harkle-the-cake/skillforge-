require('dotenv').config(); // Stelle sicher, dass dies hinzugefügt wird, um Umgebungsvariablen zu laden
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
