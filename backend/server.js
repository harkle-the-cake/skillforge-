const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const azubiRoutes = require('./routes/azubi'); // Importiere die Routen-Datei für Azubis
const classRoutes = require('./routes/classRoutes');
const levelRoutes = require('./routes/levelRoutes');
const bossRoutes = require('./routes/bossRoutes');
const imageRoutes = require('./routes/imageRoutes');
const defineAssociations = require('./config/associations');
const User = require('./models/User');
const Class = require('./models/Class');
const ClassProgress = require('./models/ClassProgress');
const Level = require('./models/Level');
const Boss = require('./models/Boss');
const Ability = require('./models/Ability');

// Zuerst die Assoziationen definieren
defineAssociations();

const path = require('path');

dotenv.config();

const app = express();

// Erlaube Anfragen von 'http://localhost:3000'
app.use(cors({
  origin: '*', // Erlaube dein Frontend
  methods: '*', // Erlaubt alle HTTP-Methoden
  allowedHeaders: '*', // Erlaubt alle Header
  credentials: true // Wenn Anmeldeinformationen wie Cookies oder HTTP-Header verwendet werden
}));

app.options('*', cors()); // Setze CORS für alle OPTIONS-Anfragen

app.use(express.json());
// Statische Dateien aus dem Ordner "public" bereitstellen
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/azubis', azubiRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/bosses', bossRoutes);
// Bild-Upload-Routen
app.use('/api/images', imageRoutes);

// Verbindung zur DB herstellen und Server starten (nur in der Laufzeit, nicht in den Tests)
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync().then(() => {
    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
    });
  });
}

// Exportiere die App, damit sie in den Tests verwendet werden kann
module.exports = app;
