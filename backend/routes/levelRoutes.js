const express = require('express');
const router = express.Router();
const levelController = require('../controllers/levelController');
const checkRole = require('../middleware/checkRole'); // Middleware zur Rollenüberprüfung

// Alle Level auflisten
router.get('/', levelController.getAllLevels);

// Alle Level für eine bestimmte Klasse auflisten
router.get('/class/:classId', levelController.getLevelsForClass);

// Ein bestimmtes Level lesen
router.get('/:id', levelController.getLevel);

// Level erstellen, aktualisieren, löschen (nur Ausbilder)
router.post('/', checkRole('Ausbilder'), levelController.createLevel);
router.put('/:id', checkRole('Ausbilder'), levelController.updateLevel);
router.delete('/:id', checkRole('Ausbilder'), levelController.deleteLevel);

module.exports = router;
