const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const Class = require('../models/Class');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const { seedUsers } = require('./seeder'); // Importiere den Seeder

describe('Class API', () => {
  let tokens;

  beforeAll(async () => {
    try {
        // Datenbankverbindung aufbauen oder Seeder laden
        await sequelize.sync();
        //console.log('Datenbankverbindung erfolgreich aufgebaut.');
        tokens = await seedUsers(); // Seed-User-Daten und Token generieren
        //console.log('User erstellt und Tokens generiert.');
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
      //console.error('Fehler beim Schließen der Datenbankverbindung:', error);
    }
  });

  // Test für das Erstellen einer Klasse
  it('should create a new class (Ausbilder only)', async () => {
    const res = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Magier',
        levels: [
          { levelNumber: 1, levelName: 'Novize', requiredXP: 100 },
          { levelNumber: 2, levelName: 'Lehrling', requiredXP: 200 },
        ],
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.className).toBe('Magier');

    const createdClass = await Class.findOne({ where: { className: 'Magier' } });
    expect(createdClass).toBeTruthy();

    const createdLevels = await Level.findAll({ where: { ClassId: createdClass.id } });
    expect(createdLevels.length).toBe(2);
  });

    const res = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Krieger',
        levels: [
          { levelNumber: 1, levelName: 'Anfänger', requiredXP: 50 },
        ],
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toBe('Zugriff verweigert. Nur Ausbilder dürfen diese Aktion durchführen.');
  });

  // Test für das Löschen einer Klasse
  it('should delete a class (Ausbilder only)', async () => {
    // Eine Klasse erstellen
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Krieger',
        levels: [
          { levelNumber: 1, levelName: 'Anfänger', requiredXP: 50 },
        ],
      });
    expect(classRes.statusCode).toEqual(201);

    // Klasse löschen
    const classId = classRes.body.id;
    const deleteRes = await request(app)
      .delete(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${tokens.instructor.token}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.message).toBe('Klasse erfolgreich gelöscht');

    const deletedClass = await Class.findByPk(classId);
    expect(deletedClass).toBeNull();
  });

  // Test für fehlende Berechtigungen beim Löschen
  it('should deny access to non-instructors for class deletion', async () => {
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.testuser1.token}`)
      .send({
        className: 'Schurke',
        levels: [
          { levelNumber: 1, levelName: 'Anfänger', requiredXP: 50 },
        ],
      });
    expect(classRes.statusCode).toEqual(201);

    const userLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    const userToken = userLoginRes.body.token;

    const classId = classRes.body.id;
    const deleteRes = await request(app)
      .delete(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(deleteRes.statusCode).toEqual(403);
    expect(deleteRes.body.error).toBe('Zugriff verweigert. Nur Ausbilder dürfen diese Aktion durchführen.');
  });

  // Test für das Aktualisieren einer Klasse
  it('should update a class (Ausbilder only)', async () => {
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Heiler',
        levels: [
          { levelNumber: 1, levelName: 'Anfänger', requiredXP: 100 },
        ],
      });
    expect(classRes.statusCode).toEqual(201);

    const classId = classRes.body.id;

    const updateRes = await request(app)
      .put(`/api/classes/${classId}`)
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Heilermeister',
        levels: [
          { id: classRes.body.levels[0].id, levelName: 'Meisterheiler', requiredXP: 300 },
        ],
      });
    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.message).toBe('Klasse erfolgreich aktualisiert');

    const updatedClass = await Class.findByPk(classId);
    expect(updatedClass.className).toBe('Heilermeister');
  });
});
