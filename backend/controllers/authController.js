const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Überprüfen, ob der Benutzername bereits existiert
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Benutzername ist bereits vergeben' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer erstellen
    const user = await User.create({ username, password: hashedPassword, role });

    res.status(201).json({ message: 'Benutzer erfolgreich erstellt', id: user.id });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);  // Logge den genauen Fehler
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Benutzer finden
    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Falsches Passwort' });

    // JWT Token erstellen
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Fehler beim Login:', error);  // Logge den genauen Fehler
    res.status(500).json({ error: 'Fehler beim Login' });
  }
};
