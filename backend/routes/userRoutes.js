const express = require('express');
const { getUserInfo, updateUserXP, updateUserAvatar } = require('../controllers/userController');
const router = express.Router();

// Benutzerinformationen abrufen
router.get('/:id', getUserInfo);

// XP aktualisieren
router.put('/:id/xp', updateUserXP);

// Avatar aktualisieren
router.put('/:id/avatar', updateUserAvatar);

module.exports = router;
