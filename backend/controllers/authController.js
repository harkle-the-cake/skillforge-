require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hier holen wir das geheime Token für Ausbilder aus den Umgebungsvariablen
const INSTRUCTOR_TOKEN = process.env.INSTRUCTOR_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { username, password, role, instructorToken } = req.body;

  try {
    // Überprüfe, ob der Benutzer die Rolle "Ausbilder" wählt
    if (role === 'Ausbilder') {
      // Wenn das Token nicht übereinstimmt, lehne die Registrierung ab
      if (instructorToken !== INSTRUCTOR_TOKEN) {
        return res.status(403).json({ error: 'Ungültiges Ausbilder-Token' });
      }
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Erstelle den Benutzer
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Benutzer erfolgreich erstellt', id: user.id });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Falsches Passwort' });
    }

    // Rolle und ID im JWT speichern
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ error: 'Fehler beim Login' });
  }
};