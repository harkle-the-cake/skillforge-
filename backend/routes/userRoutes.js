const express = require('express');
const { getUserInfo, updateUserGold, updateUserAvatar, getMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); // JWT-Authentifizierung
const router = express.Router();

// eigene Benutzerinformationen abrufen
router.get('/me', authMiddleware, getMe); // Route für den angemeldeten Benutzer

// Benutzerinformationen abrufen
router.get('/:id', getUserInfo);

// XP aktualisieren
router.put('/:id/gold', updateUserGold);

// Avatar aktualisieren
router.put('/:id/avatar', updateUserAvatar);

module.exports = router;
