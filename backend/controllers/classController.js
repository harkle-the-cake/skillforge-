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

    if (levels && levels.length > 0)
    {
        // Levels aktualisieren
        for (const level of levels) {
          await Level.update({
            ...level
          }, {
            where: { id: level.id },
          });
        }
    }


    // Erstellte Klasse samt verknüpften Levels zurückgeben
    const updatedClass = await Class.findByPk(classItem.id, {
            include: [Level]
    });
    return res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Klasse' });
  }
};
