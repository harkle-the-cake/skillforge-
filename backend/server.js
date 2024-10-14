const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const azubiRoutes = require('./routes/azubi'); // Importiere die Routen-Datei für Azubis
const classRoutes = require('./routes/classRoutes');

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// Statische Dateien aus dem Ordner "public" bereitstellen
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/api/azubis', azubiRoutes);
app.use('/api/class', classRoutes);

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
