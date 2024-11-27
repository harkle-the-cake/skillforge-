// routes/classProgressRoutes.js
const express = require('express');
const router = express.Router();
const { createClassProgress, getClassProgress,deleteClassProgress,levelUp, approveLevelUp } = require('../controllers/classProgressController');
const auth = require('../middleware/auth'); // Importiere die Middleware

router.post('/', auth, createClassProgress);
router.get('/', auth, getClassProgress);
router.delete('/:id', auth, deleteClassProgress);
router.put('/:classProgressId/level-up', auth, levelUp);

module.exports = router;
