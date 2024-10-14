require('dotenv').config(); // Stelle sicher, dass dies hinzugefügt wird, um Umgebungsvariablen zu laden
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Tabellen erfolgreich synchronisiert');
  } catch (error) {
    console.error('Fehler beim Synchronisieren der Tabellen:', error);
  }
})();

module.exports = sequelize;
