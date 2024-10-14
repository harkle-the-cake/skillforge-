const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { seedUsers } = require('./seeder'); // Importiere den Seeder
const getUserIdFromToken = require('./utils/getUserIdFromToken'); // Importiere die Hilfsfunktion

describe('Azubi API', () => {
  let azubiId;
  let tokens;

  beforeAll(async () => {
    try {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        console.log('Datenbankverbindung erfolgreich aufgebaut.');
        tokens = await seedUsers(); // Seed-User-Daten und Token generieren
        console.log('User erstellt und Tokens generiert.');
        azubiId = getUserIdFromToken(tokens.testuser1);
    } catch (error) {
        console.error('Fehler bei der Tabellensynchronisierung:', error);
    }
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

  // Test für das Ändern des Azubi-Passworts (nur für Ausbilder)
  it('should allow instructor to change an azubi password', async () => {
    const newPassword = 'newAzubiPassword123';

    const res = await request(app)
      .put(`/api/azubis/${azubiId}/password`)
      .set('Authorization', `Bearer ${tokens.instructor}`)
      .send({
        newPassword,
      });

    expect(res.statusCode).toEqual(200);

    // Prüfen, ob der Azubi sich mit dem neuen Passwort einloggen kann
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser1',
        password: newPassword,
      });
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body.token).toBeTruthy();
  });

  // Test für fehlende Berechtigungen
  it('should deny azubi the ability to change another azubi\'s password', async () => {
    const res = await request(app)
      .put(`/api/azubis/${azubiId}/password`)
      .set('Authorization', `Bearer ${tokens.testuser2}`)
      .send({
        newPassword: 'somePassword',
      });

    expect(res.statusCode).toEqual(403);
  });

  // Test für das Löschen eines Azubis
  it('should allow instructor to delete an azubi', async () => {
    const res = await request(app)
      .delete(`/api/azubis/${azubiId}`)
      .set('Authorization', `Bearer ${tokens.instructor}`);

    expect(res.statusCode).toEqual(200);

    const deletedAzubi = await User.findByPk(azubiId);
    expect(deletedAzubi).toBeNull();
  });

  // Test für fehlende Berechtigungen
  it('should deny azubi the ability to delete another azubi', async () => {
    const res = await request(app)
      .delete(`/api/azubis/${azubiId}`)
      .set('Authorization', `Bearer ${tokens.testuser2}`);

    expect(res.statusCode).toEqual(403);
  });

  // Test für das Abrufen der Stats eines Azubis
  it('should allow instructor to view azubi stats', async () => {
    const res = await request(app)
      .get(`/api/azubis/${azubiId}`)
      .set('Authorization', `Bearer ${tokens.instructor}`);

    console.error(res);

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('testuser1');
    expect(res.body.role).toBe('Azubi');
    expect(res.body.level).toBe(1);
    expect(res.body.xp).toBe(0);
  });

  // Test für das Abrufen der eigenen Stats als Azubi
  it('should allow azubi to view their own stats', async () => {
    const res = await request(app)
      .get(`/api/azubis/${azubiId}`)
      .set('Authorization', `Bearer ${tokens.testuser1}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('testuser1');
    expect(res.body.role).toBe('Azubi');
    expect(res.body.level).toBe(1);
    expect(res.body.xp).toBe(0);
  });


});
