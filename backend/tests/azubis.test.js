const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const User = require('../models/User'); // Importiere dein User-Modell
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

// Erstelle ein Test-Token für Azubis (für ungültige Anfragen)
const createAzubiToken = () => {
  return jwt.sign({ id: 1, role: 'Azubi' }, secretKey, { expiresIn: '1h' });
};

// Erstelle ein Test-Token für Ausbilder (für gültige Anfragen)
const createInstructorToken = () => {
  return jwt.sign({ id: 1, role: 'Ausbilder' }, secretKey, { expiresIn: '1h' });
};

describe('Azubi API - Role-based Access Control Tests', () => {
  let azubiId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Test-Azubi anlegen
    const azubi = await User.create({
      username: 'azubiTest',
      password: 'password123',
      role: 'Azubi',
    });
    azubiId = azubi.id;
  });

  afterAll(async () => {
    await sequelize.close(); // Datenbankverbindung schließen
  });

  it('should retrieve all Azubis if the user is an Ausbilder', async () => {
    const token = createInstructorToken(); // Ausbilder-Token
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${token}`) // Token setzen
      .expect(200); // Erfolgreicher Abruf

    expect(res.body.length).toBeGreaterThan(0); // Es sollten Azubis zurückkommen
  });

  it('should retrieve a specific Azubi if the user is an Ausbilder', async () => {
    const token = createInstructorToken(); // Ausbilder-Token
    const res = await request(app)
      .get(`/api/azubis/${azubiId}`) // Spezifischen Azubi abrufen
      .set('Authorization', `Bearer ${token}`) // Token setzen
      .expect(200); // Erfolgreicher Abruf

    expect(res.body.username).toBe('azubiTest'); // Überprüfe den zurückgegebenen Azubi
  });

  it('should delete a specific Azubi if the user is an Ausbilder', async () => {
    const token = createInstructorToken(); // Ausbilder-Token
    const res = await request(app)
      .delete(`/api/azubis/${azubiId}`) // Spezifischen Azubi löschen
      .set('Authorization', `Bearer ${token}`) // Token setzen
      .expect(200); // Erfolgreiches Löschen

    expect(res.body.message).toBe('Azubi erfolgreich gelöscht');

    // Überprüfen, ob der Azubi tatsächlich gelöscht wurde
    const deletedAzubi = await User.findByPk(azubiId);
    expect(deletedAzubi).toBeNull(); // Azubi sollte nicht mehr existieren
  });

  it('should deny access if the user is not an Ausbilder', async () => {
    const token = createAzubiToken(); // Azubi-Token
    const res = await request(app)
      .get('/api/azubis') // Versuche, die Azubis-Liste abzurufen
      .set('Authorization', `Bearer ${token}`) // Token setzen
      .expect(403); // Zugriff verweigert

    expect(res.body.error).toBe('Nur Ausbilders dürfen diesen Endpunkt aufrufen');
  });
});
