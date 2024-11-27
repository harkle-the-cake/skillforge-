// Controller: levelUpController.js
const Quest = require('../models/Quest');
const Class = require('../models/Class');
const Level = require('../models/Level');

exports.getAllQuests = async (req, res) => {
  try {
    const quests = await Quest.findAll();
    res.json(quests);
  } catch (error) {
    console.error('Fehler beim Abrufen der Quests:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quests' });
  }
};

exports.getAllQuestsWithDetails = async (req, res) => {
  try {
    const quests = await Quest.findAll({
      include: [
        {
          model: Level,
          include: [
            {
              model: Class,
              attributes: ['id', 'className'], // Nur relevante Felder laden
            },
          ],
        },
      ],
    });

    res.json(quests);
  } catch (error) {
    console.error('Fehler beim Abrufen der Quests mit Details:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quests mit Details' });
  }
};

exports.getQuestById = async (req, res) => {
  try {
    const { id } = req.params;
    const quest = await Quest.findByPk(id);

    if (!quest) {
      return res.status(404).json({ error: 'Quest nicht gefunden' });
    }

    res.json(quest);
  } catch (error) {
    console.error('Fehler beim Abrufen der Quest:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quest' });
  }
};

exports.createQuest = async (req, res) => {
  try {
    const { title, description, xpReward, goldReward, LevelId } = req.body;

    const quest = await Quest.create({
      title,
      description,
      xpReward,
      goldReward,
      LevelId,
    });

    res.status(201).json(quest);
  } catch (error) {
    console.error('Fehler beim Erstellen der Quest:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Quest' });
  }
};

exports.updateQuest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, xpReward, goldReward, LevelId } = req.body;

    const quest = await Quest.findByPk(id);

    if (!quest) {
      return res.status(404).json({ error: 'Quest nicht gefunden' });
    }

    quest.title = title || quest.title;
    quest.description = description || quest.description;
    quest.xpReward = xpReward || quest.xpReward;
    quest.goldReward = goldReward || quest.goldReward;
    quest.LevelId = LevelId || quest.LevelId;

    await quest.save();

    res.json(quest);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Quest:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Quest' });
  }
};

exports.deleteQuest = async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await Quest.findByPk(id);

    if (!quest) {
      return res.status(404).json({ error: 'Quest nicht gefunden' });
    }

    await quest.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Fehler beim Löschen der Quest:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Quest' });
  }
};

exports.getQuestsByLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const quests = await Quest.findAll({
      where: { LevelId: levelId },
    });

    res.json(quests);
  } catch (error) {
    console.error('Fehler beim Abrufen der Quests eines Levels:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Quests' });
  }
};