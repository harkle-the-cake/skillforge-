require('dotenv').config();
const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const User = require('../models/User');
const { seedUsers } = require('./seeder'); // Importiere den Seeder

const INSTRUCTOR_TOKEN = process.env.INSTRUCTOR_TOKEN;
const TRAINEE_TOKEN = process.env.TRAINEE_TOKEN;

// Testen der Authentifizierung
describe('Auth API', () => {
  let tokens;
  // Vor jedem Test: Datenbank synchronisieren (oder Seeder hinzufügen, um Testdaten zu erstellen)
  beforeAll(async () => {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        console.log('Datenbankverbindung erfolgreich aufgebaut.');
        tokens = await seedUsers(); // Seed-User-Daten und Token generieren
  });

  afterAll(async () => {
    try {
      // Datenbankverbindung sauber schließen
      await sequelize.close();
      console.log('Datenbankverbindung erfolgreich geschlossen.');
    } catch (error) {
      console.error('Fehler beim Schließen der Datenbankverbindung:', error);
    }
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuserNeu',
        password: 'password123',
        role: 'Azubi',
        registrationToken: TRAINEE_TOKEN
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
        username: 'testuserNeu',
        password: 'password123',
        role: 'Azubi',
        registrationToken: TRAINEE_TOKEN
      });

    // Dann den Login testen
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuserNeu',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuserNeu',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Falsches Passwort');
  });
});
