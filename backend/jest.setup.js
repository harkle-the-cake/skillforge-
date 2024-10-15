const sequelize = require('./config/db'); // Importiere die Datenbankverbindung
const defineAssociations = require('./config/associations');

const User = require('./models/User');
const Class = require('./models/Class');
const ClassProgress = require('./models/ClassProgress');
const Level = require('./models/Level');
const Boss = require('./models/Boss');
const Ability = require('./models/Ability');

// Zuerst die Assoziationen definieren
defineAssociations();

// Diese Funktion wird vor allen Tests ausgeführt
module.exports = async () => {
  await sequelize.sync({ alter: true }); // Datenbank synchronisieren
  console.log('Datenbank synchronisiert.');
};
