// controllers/classController.js
const Class = require('../models/Class');
const Level = require('../models/Level');
const Boss = require('../models/Boss');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: {
        model: Level
      },
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
      include: {
        model: Level,
        include: [Boss],
      },
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

// Klasse anlegen (nur Ausbilder)
exports.createClass = async (req, res) => {
  try {
    const { className, levels } = req.body;

    // Klasse erstellen
    const classItem = await Class.create({ className });

    // Überprüfen, ob Levels existieren
    if (levels && levels.length > 0) {
      for (const level of levels) {
        await Level.create({
          ...level,
          ClassId: classItem.id
        });
      }

      // Erstellte Klasse samt verknüpften Levels zurückgeben
      const createdClass = await Class.findByPk(classItem.id, {
        include: [Level]
      });
      return res.status(201).json(createdClass);
    }

    // Falls keine Levels vorhanden sind, nur die Klasse zurückgeben
    res.status(201).json(classItem);
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
    const { id } = req.params; // Stelle sicher, dass die Klasse-ID aus den Parametern kommt
    const { className, levels } = req.body;

    // Überprüfe, ob die ID vorhanden ist
    if (!id) {
      return res.status(400).json({ error: "Klassen-ID fehlt" });
    }

    const classItem = await Class.findByPk(id);
    if (!classItem) {
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    // Klasse aktualisieren
    classItem.className = className || classItem.className;
    await classItem.save();

    // Levels aktualisieren
    for (const level of levels) {
      if (level.id) {  // Nur existierende Levels aktualisieren
        const existingLevel = await Level.findByPk(level.id);
        if (existingLevel) {
          existingLevel.levelNumber = level.levelNumber;
          existingLevel.description = level.description;
          existingLevel.requiredXP = level.requiredXP;
          await existingLevel.save();
        }
      } else {
        // Neues Level anlegen
        await Level.create({
          ...level,
          ClassId: classItem.id
        });
      }
    }

    res.json({ message: 'Klasse erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Klasse' });
  }
};

