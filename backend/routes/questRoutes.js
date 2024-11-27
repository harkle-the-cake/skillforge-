const express = require('express');
const router = express.Router();
const QuestController = require('../controllers/QuestController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware

router.get('/', auth, QuestController.getAllQuests);
router.get('/:id', auth, QuestController.getQuestById);
router.get('/level/:levelId', auth, QuestController.getQuestsByLevel);
router.post('/', checkRole('Ausbilder'), QuestController.createQuest);
router.put('/:id', checkRole('Ausbilder'), QuestController.updateQuest);
router.delete('/:id', checkRole('Ausbilder'), QuestController.deleteQuest);

module.exports = router;
