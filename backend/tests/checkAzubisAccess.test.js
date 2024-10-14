const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sequelize = require('../config/db');

// Erstelle ein Test-Token für Azubis
const createAzubiToken = () => {
  return jwt.sign({ id: 1, role: 'Azubi' }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Erstelle ein Test-Token für Ausbilder
const createInstructorToken = () => {
  return jwt.sign({ id: 1, role: 'Ausbilder' }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('Azubi API - Role-based Access Control', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await User.create({ username: 'azubi1', password: 'password123', role: 'Azubi' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should deny access if the user is not an Ausbilder', async () => {
    const token = createAzubiToken(); // Erstelle ein Azubi-Token
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${token}`)
      .expect(403); // 403, da kein Ausbilder

    expect(res.body.error).toBe('Nur Ausbilders dürfen diesen Endpunkt aufrufen');
  });

  it('should allow access if the user is an Ausbilder', async () => {
    const token = createInstructorToken(); // Erstelle ein Ausbilder-Token
    const res = await request(app)
      .get('/api/azubis')
      .set('Authorization', `Bearer ${token}`)
      .expect(200); // 200, da der Benutzer ein Ausbilder ist

    expect(res.body.length).toBe(1); // Überprüfe, ob ein Azubi zurückgegeben wird
  });
});
