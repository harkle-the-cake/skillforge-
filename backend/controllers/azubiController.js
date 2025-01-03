const User = require('../models/User');
const Class = require('../models/Class');
const ClassProgress = require('../models/ClassProgress');
const Equipment = require('../models/Equipment');
const bcrypt = require('bcrypt');

// Azubis abrufen
exports.getAzubis = async (req, res) => {
  try {
    const azubis = await User.findAll({ where: { role: 'Azubi' } });
    res.json(azubis);
  } catch (error) {
    console.error('Fehler beim Abrufen der Azubis:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Azubis' });
  }
};

// Stats für den Benutzer oder einen spezifischen Azubi abrufen
exports.getAzubi = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; // ID aus dem JWT-Token
    const userRole = req.user.role; // Rolle aus dem JWT-Token

    // Wenn ein Benutzer als ID übergeben wird und der Anfragende ein Ausbilder ist
    const { id } = req.params;
    let userIdToFetch = userIdFromToken; // Standard: der Benutzer sieht nur seine eigenen Daten

    // Wenn ein Ausbilder zugreift und eine ID in den Parametern übergeben wird
    if (userRole === 'Ausbilder' && id) {
      userIdToFetch = id; // Der Ausbilder kann die Stats eines anderen Benutzers abrufen
    }

    const user = await User.findByPk(userIdToFetch, {
          attributes: ['username', 'gold', 'avatar', 'role'], // Wähle die Attribute aus, die du benötigst
          include: {
            model: ClassProgress,
            include: {
              model: Class
            },
          },
    });

    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    res.json(user);
  } catch (error) {
    console.error('Fehler beim Abrufen der Stats:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Stats' });
  }
};

// Azubi löschen
exports.deleteAzubi = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.destroy({ where: { id, role: 'Azubi' } });

    if (result === 0) {
      return res.status(404).json({ error: 'Azubi nicht gefunden oder bereits gelöscht' });
    }

    res.json({ message: 'Azubi erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Azubis:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Azubis' });
  }
};

exports.changeAzubiPassword = async (req, res) => {
  try {
    const { id } = req.params; // ID des Azubis
    const { password } = req.body; // Neues Passwort aus dem Request-Body

    // Überprüfen, ob das Passwort bereitgestellt wurde
    if (!password) {
      return res.status(400).json({ error: 'Passwort erforderlich.' });
    }

    // Benutzer finden
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10); // Salz von 10 verwenden

    // Passwort aktualisieren und `updatedAt` wird automatisch aktualisiert
    user.password = hashedPassword;
    await user.save();

    // Gebe eine Erfolgsnachricht und das aktualisierte `updatedAt` zurück
    res.json({
      message: 'Passwort erfolgreich geändert.',
      updatedAt: user.updatedAt // Das aktualisierte Datum zurückgeben
    });
  } catch (error) {
    console.error('Fehler beim Ändern des Passworts:', error);
    res.status(500).json({ error: 'Fehler beim Ändern des Passworts.' });
  }
};
