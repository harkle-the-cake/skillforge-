const sequelize = require('./config/db'); // Importiere die Datenbankverbindung

// Diese Funktion wird nach allen Tests ausgeführt
module.exports = async () => {
  await sequelize.close(); // Datenbankverbindung schließen
  console.log('Datenbankverbindung geschlossen.');
};
