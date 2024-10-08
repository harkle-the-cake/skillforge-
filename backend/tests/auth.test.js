require('dotenv').config();
const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const User = require('../models/User');

// Testen der Authentifizierung
describe('Auth API', () => {
  // Vor jedem Test: Datenbank synchronisieren (oder Seeder hinzufügen, um Testdaten zu erstellen)
  beforeAll(async () => {

     try {
         // Synchronisiere die Datenbank, damit alle Tabellen erstellt werden
         await sequelize.sync({ force: true });  // force: true erstellt die Tabellen neu
         console.log('Tabellen erfolgreich synchronisiert.');
       } catch (error) {
         console.error('Fehler bei der Tabellensynchronisierung:', error);
       }

     await User.destroy({ where: {} });  // Lösche alle Einträge in der User-Tabelle
     console.log('Alle Benutzer wurden erfolgreich gelöscht.');

  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        password: 'password123',
        role: 'Azubi',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Benutzer erfolgreich erstellt');
  });

  it('should login an existing user', async () => {
    await sequelize.sync({ force: true })
      .then(() => console.log('Tabellen erfolgreich synchronisiert.'))
      .catch(err => console.error('Fehler bei der Tabellensynchronisierung:', err));

    // Zuerst den Benutzer erstellen
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        password: 'password123',
        role: 'Azubi',
      });

    // Dann den Login testen
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser2',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser2',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Falsches Passwort');
  });
});
