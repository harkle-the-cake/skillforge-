const request = require('supertest');
const sequelize = require('../config/db'); // Datenbankverbindung
const app = require('../server');
const { seedUsers } = require('./seeder'); // User-Seeder zum Testen

describe('Boss API', () => {
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


  it('should create a new boss (Ausbilder only)', async () => {
    const res = await request(app)
      .post('/api/bosses')
      .set('Authorization', `Bearer ${tokens.instructor.token}`) // Ausbilder-Token
      .send({
        name: 'Endboss',
        description: 'Der stärkste Boss im Spiel.',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Endboss');
  });

  it('should list all bosses', async () => {
    const res = await request(app)
      .get('/api/bosses')
      .set('Authorization', `Bearer ${tokens.testuser1.token}`); // Azubi-Token

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Überprüfe, ob es ein Array ist
  });

  it('should retrieve a specific boss', async () => {
    const bossRes = await request(app)
      .post('/api/bosses')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        name: 'Drachenlord',
        description: 'Der schrecklichste Drachenlord',
      });

    const bossId = bossRes.body.id;

    const res = await request(app)
      .get(`/api/bosses/${bossId}`)
      .set('Authorization', `Bearer ${tokens.testuser1.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Drachenlord');
  });

  it('should update a boss (Ausbilder only)', async () => {
    const bossRes = await request(app)
      .post('/api/bosses')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        name: 'Miniboss',
        description: 'Ein kleiner Miniboss',
      });

    const bossId = bossRes.body.id;

    const res = await request(app)
      .put(`/api/bosses/${bossId}`)
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        name: 'Mega Miniboss',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Boss erfolgreich aktualisiert');
  });

  it('should delete a boss (Ausbilder only)', async () => {
    const bossRes = await request(app)
      .post('/api/bosses')
      .set('Authorization', `Bearer ${tokens.instructor.token}`)
      .send({
        name: 'Riesenkrake',
        description: 'Eine furchterregende Riesenkrake',
      });

    const bossId = bossRes.body.id;

    const res = await request(app)
      .delete(`/api/bosses/${bossId}`)
      .set('Authorization', `Bearer ${tokens.instructor.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Boss erfolgreich gelöscht');
  });
});
