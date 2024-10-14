const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware zur Überprüfung der Rolle
const checkRole = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // JWT-Token extrahieren
    if (!token) {
      return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Token verifizieren
      if (decoded.role !== role) {
        return res.status(403).json({ error: `Nur ${role}s dürfen diesen Endpunkt aufrufen` });
      }
      next(); // Wenn die Rolle korrekt ist, weiter zur nächsten Middleware oder Route
    } catch (error) {
      return res.status(403).json({ error: 'Ungültiges Token' });
    }
  };
};

module.exports = checkRole;
