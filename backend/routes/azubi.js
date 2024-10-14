const express = require('express');
const router = express.Router();
const azubiController = require('../controllers/azubiController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware

// Nur für Ausbilder: Azubis abrufen
router.get('/', checkRole('Ausbilder'), azubiController.getAzubis);

// Nur für Ausbilder oder Azubi selbst: Spezifischen Azubi abrufen
router.get('/:id', auth, azubiController.getAzubi);

// Nur für Ausbilder: Azubi löschen
router.delete('/:id', checkRole('Ausbilder'), azubiController.deleteAzubi);

// Nur für Ausbilder: Azubi löschen
router.put('/:id/password', checkRole('Ausbilder'), azubiController.changeAzubiPassword);

module.exports = router;
