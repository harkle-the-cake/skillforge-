// controllers/classController.js
const Class = require('../models/Class');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'public/images/classes/' });

const classesDir = path.join(__dirname, '..', 'public', 'images', 'classes');
if (!fs.existsSync(classesDir)) {
  fs.mkdirSync(classesDir, { recursive: true });
}

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Level,
          as: 'classLevels', // Assoziation "levels" direkt angeben
          include: [
            {
              model: Boss,
              as: 'boss', // Assoziation "boss" direkt angeben
            },
          ],
        },
      ],
    });
    res.json(classes);
  } catch (error) {
    console.error('Fehler beim Abrufen der Klassen:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Klassen' });
  }
};


exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classItem = await Class.findByPk(id, {
      include: [
          {
            model: Level,
            as: 'classLevels', // Assoziation "levels" direkt angeben
            include: [
              {
                model: Boss,
                as: 'boss', // Assoziation "boss" direkt angeben
              },
            ],
          },
        ],
    });

    if (!classItem) {
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    res.json(classItem);
  } catch (error) {
    console.error('Fehler beim Abrufen der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Klasse' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { className, description } = req.body;
    const imageFile = req.file; // Bild aus dem Upload
    let levels = req.body.levels;

    // Wenn levels als String ankommt, parsen
    if (typeof levels === 'string') {
      levels = JSON.parse(levels);
    }

    // Klasse erstellen
    const classItem = await Class.create({ className, description });

     // Bild speichern, falls ein neues Bild hochgeladen wurde
     if (imageFile) {
       const imagePath = `/images/classes/${classItem.id}.jpg`;
       const fullPath = path.join(__dirname, '..', 'public', imagePath);

       // Falls der Ordner nicht existiert, erstelle ihn
       const dirPath = path.dirname(fullPath);
       if (!fs.existsSync(dirPath)) {
         fs.mkdirSync(dirPath, { recursive: true });
       }

       fs.renameSync(imageFile.path, fullPath);
       classItem.imageUrl = imagePath;
     }

    // Levels hinzufügen
    if (levels && levels.length > 0) {
      for (const level of levels) {
        await Level.create({ ...level, ClassId: classItem.id });
      }
    }

    // Aktualisierte Klasse samt Levels zurückgeben
    const createdClass = await Class.findByPk(classItem.id, {
       include: [
            {
              model: Level,
              as: 'classLevels', // Assoziation "levels" direkt angeben
              include: [
                {
                  model: Boss,
                  as: 'boss', // Assoziation "boss" direkt angeben
                },
              ],
            },
          ],
    });
    res.status(201).json(createdClass);
  } catch (error) {
    console.error('Fehler beim Anlegen der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen der Klasse' });
  }
};



// Klasse löschen (nur Ausbilder)
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classItem = await Class.findByPk(id);

    if (!classItem) {
      //console.error("unable to delete class, class not found: " + id);
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    await classItem.destroy();
    res.json({ message: 'Klasse erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Klasse' });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params; // Klassen-ID aus den Parametern
    const { className, description, image } = req.body;
    const imageFile = req.file;
    let levels = req.body.levels;

    // Wenn levels als String ankommt, parsen
    if (typeof levels === 'string') {
      levels = JSON.parse(levels);
    }

    if (!id) {
      return res.status(400).json({ error: "Klassen-ID fehlt" });
    }

    const classItem = await Class.findByPk(id);
    if (!classItem) {
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    // Klasse und Bild aktualisieren
    classItem.className = className || classItem.className;
    classItem.description = description || classItem.description;

    // Bild speichern, falls ein neues Bild hochgeladen wurde
     if (imageFile) {
          const imagePath = `/images/classes/${classItem.id}.jpg`;
          const fullPath = path.join(__dirname, '..', 'public', imagePath);

          // Falls der Ordner nicht existiert, erstelle ihn
          const dirPath = path.dirname(fullPath);
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
          }

          fs.renameSync(imageFile.path, fullPath);
          classItem.imageUrl = imagePath;
    }

    await classItem.save();

    // Levels aktualisieren oder hinzufügen
    if (levels && Array.isArray(levels)) {

      // Bestehende Levels abrufen
      const existingLevels = await Level.findAll({ where: { ClassId: classItem.id } });
      const levelIds = levels.map(level => level.id).filter(id => id);

      // Nicht mehr vorhandene Levels löschen
      const levelsToDelete = existingLevels.filter(level => !levelIds.includes(level.id));
      await Promise.all(levelsToDelete.map(level => level.destroy()));

      for (const level of levels) {
        if (level.id) {
          const existingLevel = await Level.findByPk(level.id);
          if (existingLevel) {
            existingLevel.levelNumber = level.levelNumber;
            existingLevel.levelName = level.levelName;
            existingLevel.description = level.description;
            existingLevel.requiredXP = level.requiredXP;
            existingLevel.BossId = level.BossId || null; // Setzt bossId oder null, wenn kein Boss verknüpft ist
            await existingLevel.save();
          }
        } else {
          // Neues Level erstellen, wenn keine ID vorhanden ist
          await Level.create({
            ...level,
            ClassId: classItem.id,
          });
        }
      }
    }else {
       console.warn('Levels ist kein Array:', levels);
    }

    // Aktualisierte Klasse samt Levels zurückgeben
    const updatedClass = await Class.findByPk(classItem.id, {
       include: [
            {
              model: Level,
              as: 'classLevels', // Assoziation "levels" direkt angeben
              include: [
                {
                  model: Boss,
                  as: 'boss', // Assoziation "boss" direkt angeben
                },
              ],
            },
          ],
    });

    res.json(updatedClass);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Klasse' });
  }
};


exports.uploadClassImage = (req, res) => {
  const { classId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
  }

  const filePath = path.join(__dirname, '..', 'images', 'classes', `${classId}.jpg`);

  // Verschiebe die hochgeladene Datei in den Zielordner
  fs.rename(req.file.path, filePath, (err) => {
    if (err) {
      console.error('Fehler beim Verschieben der Datei:', err);
      return res.status(500).json({ error: 'Fehler beim Speichern des Bildes.' });
    }
    res.json({ message: 'Bild erfolgreich hochgeladen.', url: `/images/classes/${classId}.jpg` });
  });
};
