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

// Klasse anlegen (nur Ausbilder)
exports.createClass = async (req, res) => {
  try {
    const { className, levels } = req.body;

    const classItem = await Class.create({ className });

    for (const level of levels) {
      await Level.create({
        ...level,
        ClassId: classItem.id
      });
    }

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
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    await classItem.destroy();
    res.json({ message: 'Klasse erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Klasse' });
  }
};

// Klasse aktualisieren (nur Ausbilder)
exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, levels } = req.body;

    const classItem = await Class.findByPk(id);
    if (!classItem) {
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    classItem.className = className || classItem.className;
    await classItem.save();

    // Levels aktualisieren
    for (const level of levels) {
      const boss = level.bossId ? await Boss.findByPk(level.bossId) : null;
      await Level.update({
        ...level
      }, {
        where: { id: level.id },
      });
    }

    res.json({ message: 'Klasse erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Klasse' });
  }
};
