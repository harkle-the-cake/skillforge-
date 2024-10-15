const express = require('express');
const router = express.Router();
const bossController = require('../controllers/bossController');
const checkRole = require('../middleware/checkRole'); // Middleware zur Rollenüberprüfung

// Alle Bosses auflisten
router.get('/', bossController.getAllBosses);

// Einen Boss nach ID abrufen
router.get('/:id', bossController.getBossById);

// Boss anlegen, aktualisieren, löschen (nur Ausbilder)
router.post('/', checkRole('Ausbilder'), bossController.createBoss);
router.put('/:id', checkRole('Ausbilder'), bossController.updateBoss);
router.delete('/:id', checkRole('Ausbilder'), bossController.deleteBoss);

module.exports = router;
