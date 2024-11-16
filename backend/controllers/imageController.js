const fs = require('fs');
const path = require('path');

// Funktion zum Erstellen eines Verzeichnisses, falls es nicht existiert
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Bild hochladen und URL aktualisieren
exports.uploadImage = async (req, res) => {
  try {
    const { entity, id } = req.params;
    const modelMap = {
      classes: require('../models/Class'),
      bosses: require('../models/Boss'),
      level: require('../models/Level'),
    };

    const model = modelMap[entity];
    if (!model) {
      return res.status(400).json({ error: 'Ungültige Entität' });
    }

    const item = await model.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Eintrag nicht gefunden' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Kein Bild hochgeladen' });
    }

    const imageDir = path.join(__dirname, '..', 'public', 'images', entity);
    ensureDirectoryExists(imageDir); // Verzeichnis erstellen, falls es nicht existiert

    const imagePath = `/images/${entity}/${id}.jpg`;
    const targetPath = path.join(imageDir, `${id}.jpg`);

    // Verschieben der hochgeladenen Datei
    fs.renameSync(req.file.path, targetPath);

    // Bild-URL in der Datenbank speichern
    item.imageUrl = imagePath;
    await item.save();

    res.json(item); // Aktualisiertes Objekt zurückgeben
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    res.status(500).json({ error: 'Fehler beim Hochladen des Bildes' });
  }
};
