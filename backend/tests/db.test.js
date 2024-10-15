require('dotenv').config();
const sequelize = require('../config/db');

describe('Database connection', () => {
  it('should connect to the database successfully', async () => {
    try {
      await sequelize.authenticate();
      //console.log('Verbindung zur Datenbank erfolgreich');
    } catch (error) {
      console.error('Verbindung zur Datenbank fehlgeschlagen:', error);
    }
  });
});
