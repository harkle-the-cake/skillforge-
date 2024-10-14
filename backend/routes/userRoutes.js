const express = require('express');
const { getUserInfo, updateUserGold, updateUserAvatar, getMe } = require('../controllers/userController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware
const router = express.Router();

// Benutzerinformationen abrufen
router.get('/:id', auth, getUserInfo);

// XP aktualisieren
router.put('/:id/gold', auth, updateUserGold);

// Avatar aktualisieren
router.put('/:id/avatar', auth, updateUserAvatar);

// Passwort aktualisieren
router.put('/:id/avatar', auth, updateUserAvatar);

module.exports = router;
