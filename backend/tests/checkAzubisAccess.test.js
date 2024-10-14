const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../config/db');
const { seedUsers } = require('./seeder'); // Importiere den Seeder


describe('Azubi API - Role-based Access Control', () => {
  let tokens;
  let server;

  beforeAll(async () => {
     try {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        console.log('Datenbankverbindung erfolgreich aufgebaut.');
        tokens = await seedUsers(); // Seed-User-Daten und Token generieren
        console.log('User erstellt und Tokens generiert.');
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

  it('should deny access if the user is not an Ausbilder', async () => {
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${tokens.testuser1}`)
      .expect(403); // 403, da kein Ausbilder

    expect(res.body.error).toBe('Nur Ausbilders dürfen diesen Endpunkt aufrufen');
  });

  it('should allow access if the user is an Ausbilder', async () => {
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${tokens.instructor}`)
      .expect(200); // 200, da der Benutzer ein Ausbilder ist

    expect(res.body.length).toBe(2); // Überprüfe, ob ein Azubi zurückgegeben wird
  });

});
