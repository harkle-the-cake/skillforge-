// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const { getClasses, createClass, updateClass, deleteClass,getClassById } = require('../controllers/classController');
const classController = require('../controllers/classController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware

router.get('/', auth, getClasses);
router.get('/:id', auth, getClassById);
router.post('/', checkRole('Ausbilder'), createClass);
router.put('/:id', checkRole('Ausbilder'), updateClass); // Klasse ändern
router.delete('/:id', checkRole('Ausbilder'), deleteClass); // Klasse löschen

module.exports = router;
