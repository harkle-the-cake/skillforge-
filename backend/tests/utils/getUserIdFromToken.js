const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Secret-Key aus den Umgebungsvariablen

/**
 * Extrahiert die User-ID aus einem JWT-Token
 * @param {string} token - Das JWT-Token
 * @returns {string|null} - Die User-ID, wenn vorhanden, ansonsten null
 */
const getUserIdFromToken = (token) => {
  try {
    // Token verifizieren und dekodieren
    const decoded = jwt.verify(token, secretKey);
    // Rückgabe der Benutzer-ID
    return decoded.id;
  } catch (error) {
    console.error('Fehler beim Decodieren des Tokens:', error);
    return null; // Falls das Token ungültig ist, gib null zurück
  }
};

module.exports = getUserIdFromToken;
