// routes/classRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getClasses, createClass, updateClass, deleteClass,getClassById } = require('../controllers/classController');
const classController = require('../controllers/classController');
const checkRole = require('../middleware/checkRole'); // Importiere die Middleware
const auth = require('../middleware/auth'); // Importiere die Middleware
const upload = multer({ dest: 'public/images/classes/' });

router.get('/', auth, getClasses);
router.get('/:id', auth, getClassById);
router.post('/', checkRole('Ausbilder'), upload.single('image'), createClass);
router.put('/:id', checkRole('Ausbilder'), upload.single('image'), updateClass); // Klasse ändern
router.delete('/:id', checkRole('Ausbilder'), deleteClass); // Klasse löschen
// Bild hochladen für eine Klasse (nur Ausbilder)
router.post('/upload-image/:classId', checkRole('Ausbilder'), upload.single('image'), classController.uploadClassImage);

module.exports = router;
