const QuestProgress = require('../models/QuestProgress');
const ClassProgress = require('../models/ClassProgress');
const Class = require('../models/Class');
const Quest = require('../models/Quest');
const Level = require('../models/Level');
const User = require('../models/User');
const { Op } = require('sequelize');

// Hole den Quest-Progress für einen Benutzer
exports.getQuestProgressByUser = async (req, res) => {
  try {
    const userId = req.user.id; // ID aus dem Auth-Token
    const questProgresses = await QuestProgress.findAll({
      where: { UserId: userId },
      include: [{ model: Quest }],
    });

    res.json(questProgresses);
  } catch (error) {
    console.error('Fehler beim Abrufen des Quest-Progress:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Quest-Progress.' });
  }
};

// Aktualisiere den Status eines Quest-Progress
exports.updateQuestProgress = async (req, res) => {
  try {
    const { id } = req.params; // ID des Quest-Progress
    const { status, xpEarned, goldEarned } = req.body;

    const questProgress = await QuestProgress.findByPk(id);

    if (!questProgress) {
      return res.status(404).json({ error: 'Quest-Progress nicht gefunden.' });
    }

    questProgress.status = status || questProgress.status;
    questProgress.xpEarned = xpEarned || questProgress.xpEarned;
    questProgress.goldEarned = goldEarned || questProgress.goldEarned;

    await questProgress.save();

    res.json(questProgress);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Quest-Progress:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Quest-Progress.' });
  }
};

// Erstelle einen neuen Quest-Progress für einen Benutzer
exports.createQuestProgress = async (req, res) => {
  try {
    const { questId } = req.body;
    const userId = req.user.id;

    const existingProgress = await QuestProgress.findOne({
      where: { QuestId: questId, UserId: userId },
    });

    if (existingProgress) {
      return res.status(400).json({ error: 'Quest-Progress existiert bereits.' });
    }

    const newQuestProgress = await QuestProgress.create({
      QuestId: questId,
      UserId: userId,
      status: 'open',
    });

    res.status(201).json(newQuestProgress);
  } catch (error) {
    console.error('Fehler beim Erstellen des Quest-Progress:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Quest-Progress.' });
  }
};

// Lösche einen Quest-Progress
exports.deleteQuestProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const questProgress = await QuestProgress.findByPk(id);

    if (!questProgress) {
      return res.status(404).json({ error: 'Quest-Progress nicht gefunden.' });
    }

    await questProgress.destroy();

    res.json({ message: 'Quest-Progress erfolgreich gelöscht.' });
  } catch (error) {
    console.error('Fehler beim Löschen des Quest-Progress:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Quest-Progress.' });
  }
};
// Hole den QuestProgress für das aktuelle Level einer Klasse und lege fehlende Einträge an
exports.getOrCreateQuestProgressForCurrentLevel = async (req, res) => {
  try {
    const userId = req.user.id; // Benutzer-ID aus dem Auth-Token
    const { classId } = req.params; // Klassen-ID aus der URL

    // Finde den Klassenfortschritt für den Benutzer
    const classProgress = await ClassProgress.findOne({
      where: { UserId: userId, ClassId: classId }
    });

    if (!classProgress) {
      return res.status(404).json({ error: 'Kein Klassenfortschritt gefunden.' });
    }

    // Finde das aktuelle Level
    const currentLevel = await Level.findOne({
      where: {
        ClassId: classId,
        levelNumber: classProgress.currentLevel,
      },
    });

    if (!currentLevel) {
      return res.status(404).json({ error: 'Kein aktuelles Level gefunden.' });
    }

    // Hole alle Quests für das aktuelle Level
    const quests = await Quest.findAll({
      where: { LevelId: currentLevel.id },
    });

    if (quests.length === 0) {
      return res.json({ message: 'Keine Quests für dieses Level vorhanden.' });
    }

    // Überprüfe, ob ein QuestProgress für jede Quest existiert, und lege fehlende an
    const questProgresses = [];
    for (const quest of quests) {
      let questProgress = await QuestProgress.findOne({
        where: {
          UserId: userId,
          QuestId: quest.id,
        },
      });

      if (!questProgress) {
        // Erstelle einen neuen QuestProgress
        questProgress = await QuestProgress.create({
          UserId: userId,
          QuestId: quest.id,
          status: 'open',
          xpEarned: 0,
          goldEarned: 0,
        });
      }

      questProgresses.push({
        ...questProgress.toJSON(),
        Quest: quest,
      });
    }

    res.json(questProgresses);
  } catch (error) {
    console.error('Fehler beim Abrufen oder Erstellen von Quest-Progress:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen oder Erstellen von Quest-Progress.' });
  }
};

exports.getNextLevelQuestProgress = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;

    // Hole den Fortschritt der Klasse des Users
    const classProgress = await ClassProgress.findOne({
      where: { UserId: userId, ClassId: classId },
    });

    if (!classProgress) {
      return res.status(404).json({ error: 'Kein Klassenfortschritt gefunden.' });
    }

    // Finde das nächste Level basierend auf currentLevel
    const nextLevel = await Level.findOne({
      where: {
        ClassId: classId,
        levelNumber: { [Op.gt]: classProgress.currentLevel },
      },
      order: [['levelNumber', 'ASC']],
      include: [{ model: Quest, as: 'levelQuests' }], // Verwende den Alias 'quests'
    });

    if (!nextLevel) {
      return res.status(404).json({ error: 'Kein nächstes Level gefunden.' });
    }

    // Finde oder erstelle QuestProgress-Einträge für den User
    const questProgresses = await Promise.all(
      nextLevel.levelQuests.map(async (quest) => {
        const [questProgress] = await QuestProgress.findOrCreate({
          where: { UserId: userId, QuestId: quest.id },
          defaults: { status: 'open', xpEarned: 0, goldEarned: 0 },
        });
        return questProgress;
      })
    );

    // Füge die Quest-Daten zu den QuestProgress-Einträgen hinzu
    const questProgressWithDetails = await Promise.all(
      questProgresses.map(async (progress) => {
        const quest = await Quest.findByPk(progress.QuestId);
        return { ...progress.toJSON(), Quest: quest };
      })
    );

    res.json({
      level: nextLevel,
      questProgresses: questProgressWithDetails,
    });
  } catch (error) {
    console.error('Fehler beim Laden der QuestProgress:', error);
    res.status(500).json({ error: 'Fehler beim Laden der QuestProgress.' });
  }
};
