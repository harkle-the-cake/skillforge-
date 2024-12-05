const express = require('express');
const router = express.Router();
const questProgressController = require('../controllers/questProgressController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware

// Hole alle Quest-Progresses eines Benutzers
router.get('/', auth, questProgressController.getQuestProgressByUser);

// Aktualisiere den Status eines Quest-Progress
router.put('/:id', checkRole('Ausbilder'), questProgressController.updateQuestProgress);

// Erstelle einen neuen Quest-Progress
router.post('/', auth, questProgressController.createQuestProgress);

// Lösche einen Quest-Progress
router.delete('/:id', auth, questProgressController.deleteQuestProgress);

// Hole oder erstelle Quest-Progress für das aktuelle Level
router.get('/current-level/:classId', auth, questProgressController.getOrCreateQuestProgressForCurrentLevel);

// Hole oder erstelle Quest-Progress für das nächste Level
router.get('/next-level/:classId',auth, questProgressController.getNextLevelQuestProgress);

// Quest abschließen
router.put('/complete/:questProgressId', checkRole('Ausbilder'), questProgressController.completeQuest );

// Quest bestätigen
router.put('/confirm/:questProgressId', checkRole('Ausbilder'), questProgressController.confirmQuest );

module.exports = router;
