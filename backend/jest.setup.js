const sequelize = require('./config/db'); // Importiere die Datenbankverbindung

// Diese Funktion wird vor allen Tests ausgeführt
module.exports = async () => {
  await sequelize.sync({ force: true }); // Datenbank synchronisieren
  console.log('Datenbank synchronisiert.');
};
