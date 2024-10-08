const User = require('../models/User');

exports.getUserInfo = async (req, res) => {
  try {
    let userId = req.params.id
    // Überprüfen, ob die ID leer oder undefined ist
    if (!userId || userId === 'undefined') {
       return res.status(400).json({ message: 'Ungültige Benutzer-ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Benutzer mit id $userId  nicht gefunden' });

    res.json(user);
  } catch (error) {
    console.error('!!!! Fehler beim Abrufen der Benutzerdaten:', error);  // Logge den genauen Fehler
    res.status(500).json({ error: 'Fehler beim Abrufen der Benutzerdaten' });
  }
};

exports.updateUserXP = async (req, res) => {
  try {
    let userId = req.params.id
    // Überprüfen, ob die ID leer oder undefined ist
    if (!userId || userId === 'undefined') {
       return res.status(400).json({ message: 'Ungültige Benutzer-ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

    user.xp = req.body.xp;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der XP:', error);  // Logge den genauen Fehler
    res.status(500).json({ error: 'Fehler beim Aktualisieren der XP' });
  }
};

exports.updateUserAvatar = async (req, res) => {
  try {
    let userId = req.params.id
    // Überprüfen, ob die ID leer oder undefined ist
    if (!userId || userId === 'undefined') {
       return res.status(400).json({ message: 'Ungültige Benutzer-ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

    user.avatar = req.body.avatar;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Avatars:', error);  // Logge den genauen Fehler
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Avatars' });
  }
};
