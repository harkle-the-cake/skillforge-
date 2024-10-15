const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Dein User-Modell

const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Setze das Secret-Key für das JWT

// Seed-Testdaten für die User-Tabelle
const seedUsers = async () => {
  // Lösche alle bestehenden User-Daten
  await User.destroy({ where: {} });

  // Passwort hashen
  const hashedPassword = await bcrypt.hash('testpassword', 10);

  // Test-User-Daten einfügen
  const users = await User.bulkCreate([
    { username: 'testuser1', password: hashedPassword, role: 'Azubi' },
    { username: 'testuser2', password: hashedPassword, role: 'Azubi' },
    { username: 'instructor', password: hashedPassword, role: 'Ausbilder' }
  ]);

  // Generiere die JWT-Tokens für die Testbenutzer und die IDs
  const tokensAndIds = {
    testuser1: {
      id: users[0].id, // User-ID
      token: jwt.sign({ id: users[0].id, role: users[0].role }, secretKey, { expiresIn: '1h' })
    },
    testuser2: {
      id: users[1].id, // User-ID
      token: jwt.sign({ id: users[1].id, role: users[1].role }, secretKey, { expiresIn: '1h' })
    },
    instructor: {
      id: users[2].id, // User-ID
      token: jwt.sign({ id: users[2].id, role: users[2].role }, secretKey, { expiresIn: '1h' })
    }
  };

  return tokensAndIds; // Rückgabe der Token und der IDs
};

module.exports = { seedUsers };
