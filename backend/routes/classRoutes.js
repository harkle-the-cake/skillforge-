// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const { getClasses, createClass, updateClass, deleteClass } = require('../controllers/classController');
const classController = require('../controllers/classController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware

router.get('/', auth, getClasses);
router.post('/', checkRole('Ausbilder'), createClass);
router.put('/classes/:id', checkRole('Ausbilder'), updateClass); // Klasse ändern
router.delete('/classes/:id', checkRole('Ausbilder'), deleteClass); // Klasse löschen

module.exports = router;
