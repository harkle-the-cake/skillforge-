const User = require('../models/User');
const Class = require('../models/Class');
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
          attributes: ['username', 'gold', 'avatar'], // Wähle die Attribute aus, die du benötigst
          include: [
            {
              model: Class, // Falls es eine separate Tabelle für Klassen gibt
              as: 'classes',
              attributes: ['className', 'level', 'xp'], // Attribute für jede Klasse
            },
            {
              model: Equipment, // Falls es eine separate Tabelle für Ausrüstung gibt
              as: 'equipment',
              attributes: ['itemName'], // Name der Ausrüstung
            },
          ],
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
    const { id } = req.params; // ID des Azubis aus der URL
    const { newPassword } = req.body; // Neues Passwort aus dem Request-Body

    // Finde den Azubi in der Datenbank
    const azubi = await User.findOne({ where: { id, role: 'Azubi' } });

    if (!azubi) {
      return res.status(404).json({ error: 'Azubi nicht gefunden' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Passwort in der Datenbank aktualisieren
    azubi.password = hashedPassword;
    await azubi.save();

    res.json({ message: 'Passwort erfolgreich geändert' });
  } catch (error) {
    console.error('Fehler beim Ändern des Passworts:', error);
    res.status(500).json({ error: 'Serverfehler' });
  }
};