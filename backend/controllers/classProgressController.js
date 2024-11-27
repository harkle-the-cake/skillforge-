// controllers/classProgressController.js
const ClassProgress = require('../models/ClassProgress');
const Class = require('../models/Class');
const Level = require('../models/Level');
const Boss = require('../models/Boss');
const { Op } = require('sequelize'); // Sequelize-Operatoren importieren


exports.createClassProgress = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; // ID aus dem JWT-Token
    const { classId } = req.body;

    //console.log(userIdFromToken);

    // Prüfen, ob die Klasse existiert
    const classItem = await Class.findByPk(classId);
    if (!classItem) {
      return res.status(404).json({ error: 'Klasse nicht gefunden' });
    }

    // Prüfen, ob der Azubi bereits dieser Klasse zugeordnet ist
    const existingProgress = await ClassProgress.findOne({
      where: { UserId: userIdFromToken, ClassId: classId },
    });

    if (existingProgress) {
      return res.status(400).json({ error: 'Azubi ist dieser Klasse bereits zugeordnet' });
    }

    // Neuen Fortschritt erstellen
    const classProgress = await ClassProgress.create({
      UserId: userIdFromToken,
      ClassId: classId,
      progress: 0, // Standardwert
      currentLevel: 0, // Standardwert
    });

    res.status(201).json(classProgress);
  } catch (error) {
    console.error('Fehler beim Erstellen des Klassenfortschritts:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Klassenfortschritts' });
  }
};

exports.getClassProgress = async (req, res) => {
  try {
    const userIdFromToken = req.user.id; // ID aus dem JWT-Token

    const progress = await ClassProgress.findAll({
      where: { UserId: userIdFromToken },
      include: [
        {
          model: Class,
          include: [
            {
              model: Level,
              as: 'classLevels', // Stellt sicher, dass die Levels unter diesem Alias verfügbar sind
            },
          ],
        },
      ],
    });

    res.json(progress);
  } catch (error) {
    console.error('Fehler beim Abrufen des Klassenfortschritts:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Klassenfortschritts' });
  }
};


exports.deleteClassProgress = async (req, res) => {
   try {
      const userIdFromToken = req.user.id; // ID aus dem JWT-Token
      const { id } = req.params;

      // Prüfen, ob der Azubi bereits dieser Klasse zugeordnet ist
      const existingProgress = await ClassProgress.findOne({
        where: { UserId: userIdFromToken, ClassId: id },
      });

      if (!existingProgress) {
        return res.status(404).json({ error: 'Azubi ist dieser Klasse nicht zugeordnet' });
      }

      await existingProgress.destroy();
      res.json({ message: 'Klassenfortschritt erfolgreich gelöscht' });

    } catch (error) {
      console.error('Fehler beim Erstellen des Klassenfortschritts:', error);
      res.status(500).json({ error: 'Fehler beim Erstellen des Klassenfortschritts' });
    }
};

exports.levelUp = async (req, res) => {
  try {
    const { classProgressId } = req.params;

    const classProgress = await ClassProgress.findByPk(classProgressId, {
      include: [
        {
          model: Class,
        },
      ],
    });

    if (!classProgress) {
      throw new Error('ClassProgress nicht gefunden');
    }

    const nextLevel = await Level.findOne({
      where: {
        ClassId: classProgress.Class.id,
        levelNumber: {
          [Op.gt]: classProgress.currentLevel, // Level größer als das aktuelle Level
        },
      },
      order: [['levelNumber', 'ASC']], // Das nächsthöhere Level wählen
      include: [
        {
          model: Boss,
          as: 'boss',
        },
      ],
    });

    if (!nextLevel) {
      return res.status(404).json({ error: 'Kein nächstes Level gefunden' });
    }

    // Markiere den Level-Up-Status
    classProgress.status = 'leveling-up';
    classProgress.levelUpPending = true;
    await classProgress.save();

    // Pseudo-Boss erstellen, wenn kein Boss vorhanden ist
    const boss = nextLevel.boss || {
      id: 'pseudo-boss', // Eine eindeutige, statische ID
      name: 'Quests einreichen',
      description: 'Reiche deine Quests ein. Präsentiere deinem Questgeber deine Ergebnisse.',
      imageUrl: '/images/default_quest_end.png', // Ein Standardbild
    };

    res.json(boss);
  } catch (error) {
    console.error('Fehler beim Level-Up:', error);
    res.status(500).json({ error: 'Fehler beim Level-Up' });
  }
};
