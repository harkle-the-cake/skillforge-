const express = require('express');
const { getUserInfo, updateUserGold, updateUserAvatar, getMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // JWT-Authentifizierung
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const router = express.Router();

// Benutzerinformationen abrufen
router.get('/:id', authMiddleware, getUserInfo);

// XP aktualisieren
router.put('/:id/gold', authMiddleware, updateUserGold);

// Avatar aktualisieren
router.put('/:id/avatar', authMiddleware, updateUserAvatar);

// Passwort aktualisieren
router.put('/:id/avatar', authMiddleware, updateUserAvatar);

module.exports = router;
