const express = require('express');
const router = express.Router();
const { getPendingLevelUps, approveLevelUp } = require('../controllers/levelUpController');
const auth = require('../middleware/auth'); // Importiere die Middleware
const checkRole = require('../middleware/checkRole'); // Middleware zur Rollenüberprüfung

router.get('/', checkRole('Ausbilder'), getPendingLevelUps); // Nur für Trainer
router.post('/:id/approve', checkRole('Ausbilder'), approveLevelUp);

module.exports = router;
