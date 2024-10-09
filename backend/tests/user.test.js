require('dotenv').config();
const request = require('supertest');
const app = require('../server'); // Importiere deine Express-App
const sequelize = require('../config/db'); // Datenbankverbindung
const jwt = require('jsonwebtoken');
// Stelle sicher, dass das User-Modell importiert wird

const User = require('../models/User');
const Class = require('../models/Class');
const Equipment = require('../models/Equipment');

const bcrypt = require('bcrypt');

const secretKey = process.env.JWT_SECRET;
const userName = 'testuserNeu';
const userPW = 'password123';



describe('User API', () => {
  // Variablen für Token und Benutzer-ID
  let token;
  let userId;

  // Seeder für Testdaten
  const seedTestData = async () => {
       const hashedPassword = await bcrypt.hash(userPW, 10); // Passwort hashen
        const user = await User.create({
          username: userName,
          password: hashedPassword,
          role: 'Azubi',
        });
        console.log('Erstellter Benutzer:', user);  // Zeige den erstellten Benutzer an

        // Klassen erstellen
        await Class.bulkCreate([
            { className: 'Netzwerk-Novize', level: 3, xp: 120, userId: user.id },
            { className: 'Datenbank-Meister', level: 2, xp: 80, userId: user.id },
        ]);

        // Ausrüstungsgegenstände erstellen
        await Equipment.bulkCreate([
            { itemName: 'Anfänger-Rüstung', userId: user.id },
            { itemName: 'Schwert des Wissens', userId: user.id },
        ]);
  };

  beforeAll(async () => {
try {
    // Synchronisiere die Datenbank, damit alle Tabellen erstellt werden
    await sequelize.sync({ force: true });  // force: true erstellt die Tabellen neu
    console.log('Tabellen erfolgreich synchronisiert.');
  } catch (error) {
    console.error('Fehler bei der Tabellensynchronisierung:', error);
  }


      await User.destroy({ where: {} });  // Lösche alle Einträge in der User-Tabelle
      console.log('Alle Benutzer wurden erfolgreich gelöscht.');

      await seedTestData();  // Testdaten einfügen

      // Benutzer einloggen
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: userName,
          password: userPW,
        });

      console.log('Login Response:', loginRes.body);  // Überprüfe die Antwort

      token = loginRes.body.token;  // JWT-Token speichern

      if (!token) {
        throw new Error('Kein JWT-Token erhalten.');
      }

      const decoded = jwt.verify(token, secretKey);
      userId = decoded.id;  // Benutzer-ID extrahieren
      console.log(`Extrahierte Benutzer-ID: ${userId}`);

      console.log(`Nutze USER ID: ${userId}`);
      console.log(`Nutze TOKEN: ${token}`);

      if (!userId || !token) {
        throw new Error('Benutzer-ID oder Token wurden nicht korrekt gesetzt.');
      }

  });

  it('should return 400 if userId is undefined', async () => {
      const res = await request(app)
        .get('/api/users/undefined')  // Ungültige Benutzer-ID
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);  // Überprüfe den 400er-Statuscode
      expect(res.body.message).toBe('Ungültige Benutzer-ID');  // Überprüfe die Fehlermeldung
  });

  it('should get user information', async () => {
    try {
        console.log(`Nutze USER ID HIER: ${userId}`);
        const res = await request(app)
          .get(`/api/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toBe(userName);
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
  });



  // Test für das Aktualisieren von XP
  it('should update user Gold', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/gold`)  // XP aktualisieren
      .send({ gold: 100 })  // Sende neue XP
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);  // Überprüfe den Statuscode
    expect(res.body.gold).toBe(100);  // XP sollten aktualisiert worden sein
  });

  // Test für das Ändern des Benutzer-Avatars
  it('should update user avatar', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/avatar`)  // Avatar aktualisieren
      .send({ avatar: 'new_avatar.png' })  // Sende neuen Avatar
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);  // Überprüfe den Statuscode
    expect(res.body.avatar).toBe('new_avatar.png');  // Avatar sollte geändert sein
  });

  // Nach allen Tests die Datenbankverbindung schließen
  afterAll(async () => {
    await sequelize.close();  // Schließe die Datenbankverbindung
  });
});
