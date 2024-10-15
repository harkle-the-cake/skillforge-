const Level = require('../models/Level');
const Ability = require('../models/Ability');
const Boss = require('../models/Boss');

// Level anlegen
exports.createLevel = async (req, res) => {
  try {
    const { levelNumber, levelName, description, requiredXP, classId, bossId, abilities } = req.body;

    const boss = bossId ? await Boss.findByPk(bossId) : null;

    const level = await Level.create({
      levelNumber,
      levelName,
      description,
      requiredXP,
      ClassId: classId, // Klasse zuordnen
      BossId: boss ? boss.id : null, // Boss optional
    });

    // Abilities hinzufügen
    if (abilities && abilities.length > 0) {
      for (const ability of abilities) {
        await Ability.create({
          title: ability.title,
          description: ability.description,
          LevelId: level.id, // Verknüpfung mit dem Level
        });
      }
    }

    const createdLevel = await Level.findByPk(level.id, {
      include: [Ability, Boss],
    });

    res.status(201).json(createdLevel);
  } catch (error) {
    console.error('Fehler beim Erstellen des Levels:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Levels' });
  }
};

// Level löschen
exports.deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findByPk(id);

    if (!level) {
      return res.status(404).json({ error: 'Level nicht gefunden' });
    }

    await level.destroy();
    res.json({ message: 'Level erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Levels:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Levels' });
  }
};

// Level aktualisieren
exports.updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { levelNumber, description, requiredXP, bossId, abilities } = req.body;

    const level = await Level.findByPk(id);
    if (!level) {
      return res.status(404).json({ error: 'Level nicht gefunden' });
    }

    level.levelName = levelName || level.levelName;
    level.levelNumber = levelNumber || level.levelNumber;
    level.description = description || level.description;
    level.requiredXP = requiredXP || level.requiredXP;
    level.BossId = bossId ? bossId : level.BossId;

    await level.save();

    // Abilities aktualisieren
    if (abilities && abilities.length > 0) {
      await Ability.destroy({ where: { LevelId: level.id } }); // Vorherige Fähigkeiten löschen
      for (const ability of abilities) {
        await Ability.create({
          title: ability.title,
          description: ability.description,
          LevelId: level.id,
        });
      }
    }

    const updatedLevel = await Level.findByPk(level.id, {
      include: [Ability, Boss],
    });

    res.json(updatedLevel);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Levels:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Levels' });
  }
};

// Alle Level auflisten
exports.getAllLevels = async (req, res) => {
  try {
    const levels = await Level.findAll({
      include: [Ability, Boss],
    });
    res.json(levels);
  } catch (error) {
    console.error('Fehler beim Abrufen der Level:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Level' });
  }
};

// Alle Level für eine bestimmte Klasse auflisten
exports.getLevelsForClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const levels = await Level.findAll({
      where: { ClassId: classId }, // Nutze die richtige Spalte für die Klasse
      include: [Ability, Boss],
    });
    res.json(levels);
  } catch (error) {
    console.error('Fehler beim Abrufen der Level für die Klasse:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Level für die Klasse' });
  }
};

// Ein bestimmtes Level lesen
exports.getLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findByPk(id, {
      include: [Ability, Boss],
    });

    if (!level) {
      return res.status(404).json({ error: 'Level nicht gefunden' });
    }

    res.json(level);
  } catch (error) {
    console.error('Fehler beim Abrufen des Levels:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Levels' });
  }
};
