const Boss = require('../models/Boss');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'public/images/classes/' });


const classesDir = path.join(__dirname, '..', 'public', 'images', 'bosses');
if (!fs.existsSync(classesDir)) {
  fs.mkdirSync(classesDir, { recursive: true });
}

// Boss anlegen (nur Ausbilder)
exports.createBoss = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageFile = req.file; // Bild aus dem Upload
    const boss = await Boss.create({ name, description });

    // Bild speichern, falls ein neues Bild hochgeladen wurde
    if (imageFile) {
       const imagePath = `/images/bosses/${boss.id}.jpg`;
       const fullPath = path.join(__dirname, '..', 'public', imagePath);

       // Falls der Ordner nicht existiert, erstelle ihn
       const dirPath = path.dirname(fullPath);
       if (!fs.existsSync(dirPath)) {
         fs.mkdirSync(dirPath, { recursive: true });
       }

       fs.renameSync(imageFile.path, fullPath);
       boss.imageUrl = imagePath;
    }

    res.status(201).json(boss);
  } catch (error) {
    console.error('Fehler beim Anlegen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen des Bosses' });
  }
};

// Alle Bosses auflisten
exports.getAllBosses = async (req, res) => {
  try {
    const bosses = await Boss.findAll();
    res.json(bosses);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Bosses' });
  }
};

// Einen Boss nach ID abrufen
exports.getBossById = async (req, res) => {
  try {
    const { id } = req.params;
    const boss = await Boss.findByPk(id);

    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    res.json(boss);
  } catch (error) {
    console.error('Fehler beim Abrufen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Bosses' });
  }
};

// Boss aktualisieren (nur Ausbilder)
exports.updateBoss = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const imageFile = req.file;

    console.log(name);
    console.log(imageFile);

    const boss = await Boss.findByPk(id);
    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    // Bild speichern, falls ein neues Bild hochgeladen wurde
     if (imageFile) {
          const imagePath = `/images/bosses/${boss.id}.jpg`;
          const fullPath = path.join(__dirname, '..', 'public', imagePath);

          // Falls der Ordner nicht existiert, erstelle ihn
          const dirPath = path.dirname(fullPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }

          fs.renameSync(imageFile.path, fullPath);
          boss.imageUrl = imagePath;
    }

    boss.name = name || boss.name;
    boss.description = description || boss.description;
    await boss.save();

    res.status(200).json(boss);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Bosses' });
  }
};

// Boss löschen (nur Ausbilder)
exports.deleteBoss = async (req, res) => {
  try {
    const { id } = req.params;
    const boss = await Boss.findByPk(id);

    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    await boss.destroy();
    res.json({ message: 'Boss erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Bosses' });
  }
};
