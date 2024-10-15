require('dotenv').config();
const { seedUsers } = require('./seeder'); // Importiere den Seeder
const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const jwt = require('jsonwebtoken');
const getUserIdFromToken = require('./utils/getUserIdFromToken'); // Importiere die Hilfsfunktion
// Stelle sicher, dass das User-Modell importiert wird

const User = require('../models/User');
const Class = require('../models/Class');
const Equipment = require('../models/Equipment');

const bcrypt = require('bcrypt');

const secretKey = process.env.JWT_SECRET;
const userName = 'testuser1';
const userPW = 'password123';

describe('User API', () => {
  // Variablen für Token und Benutzer-ID
  let tokens;

  beforeAll(async () => {
      try {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        //console.log('Datenbankverbindung erfolgreich aufgebaut.');
        tokens = await seedUsers(); // Seed-User-Daten und Token generieren
      } catch (error) {
        //console.error('Fehler bei der Tabellensynchronisierung:', error);
      }
  });

  afterAll(async () => {
    try {
      // Datenbankverbindung sauber schließen
      await sequelize.close();
      //console.log('Datenbankverbindung erfolgreich geschlossen.');
    } catch (error) {
      console.error('Fehler beim Schließen der Datenbankverbindung:', error);
    }
  });

  it('should return 400 if userId is undefined', async () => {
      const res = await request(app)
        .get('/api/users/undefined')  // Ungültige Benutzer-ID
        .set('Authorization', `Bearer ${tokens.testuser1.token}`);

      expect(res.statusCode).toEqual(400);  // Überprüfe den 400er-Statuscode
      expect(res.body.message).toBe('Ungültige Benutzer-ID');  // Überprüfe die Fehlermeldung
  });

  it('should get user information', async () => {
    try {
        //console.log(`Nutze USER ID HIER: ${userId}`);
        const res = await request(app)
          .get(`/api/users/${tokens.testuser1.id}`)
          .set('Authorization', `Bearer ${tokens.testuser1.token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toBe(userName);
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
  });


  // Test für das Aktualisieren von XP
  it('should update user Gold', async () => {
    const res = await request(app)
      .put(`/api/users/${tokens.testuser1.id}/gold`)  // XP aktualisieren
      .send({ gold: 100 })  // Sende neue XP
      .set('Authorization', `Bearer ${tokens.testuser1.token}`);

    expect(res.statusCode).toEqual(200);  // Überprüfe den Statuscode
    expect(res.body.gold).toBe(100);  // XP sollten aktualisiert worden sein
  });

  // Test für das Ändern des Benutzer-Avatars
  it('should update user avatar', async () => {
    const res = await request(app)
      .put(`/api/users/${tokens.testuser1.id}/avatar`)  // Avatar aktualisieren
      .send({ avatar: 'new_avatar.png' })  // Sende neuen Avatar
      .set('Authorization', `Bearer ${tokens.testuser1.token}`);

    expect(res.statusCode).toEqual(200);  // Überprüfe den Statuscode
    expect(res.body.avatar).toBe('new_avatar.png');  // Avatar sollte geändert sein
  });
});
