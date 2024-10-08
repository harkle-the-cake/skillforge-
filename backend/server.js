const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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
