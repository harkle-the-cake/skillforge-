const { seedUsers } = require('./seeder'); // Die Seeder-Funktion für User
const request = require('supertest');
const sequelize = require('../config/db'); // Datenbankverbindung
const app = require('../server'); // Dein Express-Server

const User = require('../models/User');
const Class = require('../models/Class');
const ClassProgress = require('../models/ClassProgress');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const Ability = require('../models/Ability');

describe('Level API', () => {

    let tokens;

    beforeAll(async () => {
       try {
              // Datenbankverbindung aufbauen oder Seeder laden
              await sequelize.sync();
              //console.log('Datenbankverbindung erfolgreich aufgebaut.');
              //console.log('Tabellen erfolgreich synchronisiert.');
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
          //console.error('Fehler beim Schließen der Datenbankverbindung:', error);
        }
    });

  it('should list all levels', async () => {
    const res = await request(app)
      .get('/api/levels')
      .set('Authorization', `Bearer ${tokens.testuser1.token}`); // Azubi-Token

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Überprüfe, ob es ein Array ist
  });

  it('should list all levels for a specific class', async () => {
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`) // Ausbilder-Token
      .send({
        className: 'Magier',
      });

    const classId = classRes.body.id;

    const levelRes = await request(app)
      .post('/api/levels')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        levelNumber: 1,
        description: 'Anfänger-Magier',
        requiredXP: 200,
        levelName: "test",
        classId
      });

    const res = await request(app)
      .get(`/api/levels/class/${classId}`)
      .set('Authorization', `Bearer ${tokens.testuser1.token}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].description).toBe('Anfänger-Magier');
  });

  it('should retrieve a specific level', async () => {
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        className: 'Krieger',
      });

    const classId = classRes.body.id;

    const levelRes = await request(app)
      .post('/api/levels')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        levelNumber: 1,
        description: 'Anfänger-Krieger',
        requiredXP: 100,
        levelName: "test",
        classId,
      });

    const levelId = levelRes.body.id;

    const res = await request(app)
      .get(`/api/levels/${levelId}`)
      .set('Authorization', `Bearer ${tokens.testuser1.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.description).toBe('Anfänger-Krieger');
  });

  // Test für das Erstellen eines Levels mit einem Boss
  it('should create a level with a boss', async () => {
    // Erstelle eine Klasse, um das Level zu verknüpfen
    const classRes = await request(app)
      .post('/api/classes')
      .set('Authorization', `Bearer ${tokens.instructor.token}`) // Instructor Token verwenden
      .send({
        className: 'Magier',
        levels: []
      });

    const classId = classRes.body.id;

    // Erstelle einen Boss
    const bossRes = await request(app)
      .post('/api/bosses')
      .set('Authorization', `Bearer ${tokens.instructor.token}`) // Instructor Token verwenden
      .send({
        name: 'Dunkler Lord',
        description: 'Der mächtigste Magierboss',
      });

    const bossId = bossRes.body.id;

    // Erstelle das Level mit einem Boss
    const res = await request(app)
      .post('/api/levels')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        levelNumber: 2,
        description: 'Fortgeschrittener Magier',
        requiredXP: 500,
        levelName: "test",
        classId,
        bossId // Verknüpfe den Boss
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.levelNumber).toEqual(2);
    expect(res.body.boss.name).toBe('Dunkler Lord');
  });
});
