// routes/classProgressRoutes.js
const express = require('express');
const router = express.Router();
const { createClassProgress, getClassProgress,deleteClassProgress,prepareLevelUp, approveLevelUp } = require('../controllers/classProgressController');
const auth = require('../middleware/auth'); // Importiere die Middleware

router.post('/', auth, createClassProgress);
router.get('/', auth, getClassProgress);
router.delete('/:id', auth, deleteClassProgress);
router.post('/:classId/prepare-level-up', auth, prepareLevelUp);

module.exports = router;
