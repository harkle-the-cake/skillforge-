// controllers/classController.js
const Class = require('../models/Class');
const Level = require('../models/Level');
const Boss = require('../models/Boss');

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: {
        model: Level,
        include: [Boss],
      },
    });
    res.json(classes);
  } catch (error) {
    console.error('Fehler beim Abrufen der Klassen:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Klassen' });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { className, levels } = req.body;
    const newClass = await Class.create({ className });

    // Levels erstellen und mit der Klasse verbinden
    if (levels && levels.length > 0) {
      for (const level of levels) {
        await Level.create({ ...level, ClassId: newClass.id });
      }
    }

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Fehler beim Erstellen der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Klasse' });
  }
};
