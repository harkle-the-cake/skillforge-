const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const User = require('../models/User'); // Importiere dein User-Modell
const jwt = require('jsonwebtoken');
const { seedUsers } = require('./seeder'); // Importiere den Seeder
const getUserIdFromToken = require('./utils/getUserIdFromToken'); // Importiere die Hilfsfunktion

describe('Azubi API - Role-based Access Control Tests', () => {
  let azubiId;
  let tokens;

  beforeAll(async () => {
    try {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        console.log('Datenbankverbindung erfolgreich aufgebaut.');
        console.log('Tabellen erfolgreich synchronisiert.');
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

  afterAll(async () => {
    await sequelize.close(); // Datenbankverbindung schließen
  });

  it('should retrieve all Azubis if the user is an Ausbilder', async () => {
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${tokens.instructor}`) // Token setzen
      .expect(200); // Erfolgreicher Abruf

    expect(res.body.length).toBeGreaterThan(0); // Es sollten Azubis zurückkommen
  });

  it('should retrieve a specific Azubi if the user is an Ausbilder', async () => {
    const res = await request(app)
      .get(`/api/azubis/${azubiId}`) // Spezifischen Azubi abrufen
      .set('Authorization', `Bearer ${tokens.instructor}`) // Token setzen
      .expect(200); // Erfolgreicher Abruf

    expect(res.body.username).toBe('azubiTest'); // Überprüfe den zurückgegebenen Azubi
  });

  it('should delete a specific Azubi if the user is an Ausbilder', async () => {
    const res = await request(app)
      .delete(`/api/azubis/${azubiId}`) // Spezifischen Azubi löschen
      .set('Authorization', `Bearer ${tokens.instructor}`) // Token setzen
      .expect(200); // Erfolgreiches Löschen
    // Überprüfen, ob der Azubi tatsächlich gelöscht wurde
    const deletedAzubi = await User.findByPk(azubiId);
    expect(deletedAzubi).toBeNull(); // Azubi sollte nicht mehr existieren
  });

  it('should deny access if the user is not an Ausbilder', async () => {
    const res = await request(app)
      .get('/api/azubis') // Versuche, die Azubis-Liste abzurufen
      .set('Authorization', `Bearer ${tokens.testuser1  }`) // Token setzen
      .expect(403); // Zugriff verweigert
  });
});
