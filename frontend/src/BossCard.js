import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BossCard = ({ boss, onDefeat }) => {
  const [imageError, setImageError] = useState(false);

  const bossImage = imageError
    ? '/images/default-boss.png' // Standardbild für den Boss
    : boss.imageUrl
    ? `${API_URL}${boss.imageUrl}`
    : '/images/default-boss.png';

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Paper
      style={{
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Boss-Bild */}
      <img
        src={bossImage}
        alt={boss.name || 'Unbekannter Boss'}
        onError={handleImageError} // Fallback auf Default-Bild bei Fehler
        style={{
          width: '80%',
          height: '200px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '10px',
        }}
      />

      {/* Boss-Details */}
      <Typography variant="h5" style={{ marginBottom: '10px' }}>
        {boss.name || 'Unbekannter Boss'}
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        {boss.description || 'Keine Beschreibung verfügbar.'}
      </Typography>

      {/* Boss-Interaktion */}
      {onDefeat && (
        <Button
          variant="contained"
          color="primary"
          onClick={onDefeat}
          style={{
            marginTop: '10px',
          }}
        >
          Boss besiegen
        </Button>
      )}
    </Paper>
  );
};

export default BossCard;
