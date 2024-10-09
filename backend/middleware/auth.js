const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Füge die Benutzerinformationen in die Anfrage ein
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

module.exports = authMiddleware;
