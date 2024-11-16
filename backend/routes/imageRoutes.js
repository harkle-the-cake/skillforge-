const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const imageController = require('../controllers/imageController');

// Route für Bild-Upload
router.post('/:entity/:id/image', upload.single('image'), imageController.uploadImage);

module.exports = router;
