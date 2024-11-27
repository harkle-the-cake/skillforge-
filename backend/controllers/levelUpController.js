// Controller: levelUpController.js
const Level = require('../models/Level');
const Ability = require('../models/Ability');
const Boss = require('../models/Boss');
const User = require('../models/User');
const Class = require('../models/Class');
const ClassProgress = require('../models/ClassProgress');

exports.getPendingLevelUps = async (req, res) => {
  try {
    const pendingLevelUps = await ClassProgress.findAll({
      where: { levelUpPending: true }, // Nur Level-Ups, die ausstehend sind
      include: [
        {
          model: User,
          attributes: ['id', 'username'], // Nur relevante User-Daten
        },
        {
          model: Class,
          include: [
            {
              model: Level,
              as: 'levels', // Assoziation "levels" direkt angeben
              attributes: ['levelNumber', 'levelName'], // Aktuelle und nächste Level
            },
          ],
        },
      ],
    });

    res.json(pendingLevelUps);
  } catch (error) {
    console.error('Fehler beim Abrufen der ausstehenden Level-Ups:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der ausstehenden Level-Ups' });
  }
};

exports.approveLevelUp = async (req, res) => {
  try {
    const { id } = req.params;

    const classProgress = await ClassProgress.findByPk(id);
    if (!classProgress) {
      return res.status(404).json({ error: 'ClassProgress nicht gefunden' });
    }

    classProgress.levelUpPending = false; // Status zurücksetzen
    classProgress.currentLevel += 1; // Level erhöhen
    await classProgress.save();

    res.json({ message: 'Level-Up erfolgreich bestätigt' });
  } catch (error) {
    console.error('Fehler beim Bestätigen des Level-Ups:', error);
    res.status(500).json({ error: 'Fehler beim Bestätigen des Level-Ups' });
  }
};