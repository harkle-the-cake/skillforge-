import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BossCard = ({ boss, onDefeat }) => {
  if (!boss) {
    return null;
  }

  return (
    <Paper
      style={{
        height:'400px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '400px'
      }}
    >
      <Typography variant="h4" gutterBottom>
        {boss.name}
      </Typography>
      <img
        src={boss.imageUrl ? `${API_URL}${boss.imageUrl}` : '/images/default-boss.png'}
        alt={boss.name}
        style={{
          width: '100%',
          maxHeight: '200px',
          objectFit: 'contain',
          borderRadius: '10px',
          marginBottom: '20px',
        }}
      />
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        {boss.description}
      </Typography>
    </Paper>
  );
};

export default BossCard;
