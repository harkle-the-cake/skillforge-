const Boss = require('../models/Boss');

// Boss anlegen (nur Ausbilder)
exports.createBoss = async (req, res) => {
  try {
    const { name, description } = req.body;

    const boss = await Boss.create({ name, description });
    res.status(201).json(boss);
  } catch (error) {
    console.error('Fehler beim Anlegen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Anlegen des Bosses' });
  }
};

// Alle Bosses auflisten
exports.getAllBosses = async (req, res) => {
  try {
    const bosses = await Boss.findAll();
    res.json(bosses);
  } catch (error) {
    console.error('Fehler beim Abrufen der Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Bosses' });
  }
};

// Einen Boss nach ID abrufen
exports.getBossById = async (req, res) => {
  try {
    const { id } = req.params;
    const boss = await Boss.findByPk(id);

    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    res.json(boss);
  } catch (error) {
    console.error('Fehler beim Abrufen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Bosses' });
  }
};

// Boss aktualisieren (nur Ausbilder)
exports.updateBoss = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const boss = await Boss.findByPk(id);
    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    boss.name = name || boss.name;
    boss.description = description || boss.description;
    await boss.save();

    res.json({ message: 'Boss erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Bosses' });
  }
};

// Boss löschen (nur Ausbilder)
exports.deleteBoss = async (req, res) => {
  try {
    const { id } = req.params;
    const boss = await Boss.findByPk(id);

    if (!boss) {
      return res.status(404).json({ error: 'Boss nicht gefunden' });
    }

    await boss.destroy();
    res.json({ message: 'Boss erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen des Bosses:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Bosses' });
  }
};
