import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ViewClass = ({ token }) => {
  const { id } = useParams(); // Die ID der Klasse aus der URL
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Abrufen der Klassendaten
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/classes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassData(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Klasse:', error);
        setError('Fehler beim Abrufen der Klasse.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id, token]);

  if (loading) {
    return <Typography>Laden...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Klasse: {classData.className}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Levels:
        </Typography>

        <List>
          {classData.Levels.length > 0 ? (
            classData.Levels.map((level) => (
              <ListItem key={level.id}>
                <ListItemText
                  primary={`Level ${level.levelNumber}: ${level.description}`}
                  secondary={`Benötigte XP: ${level.requiredXP}`}
                />
                {level.Boss && (
                  <Typography variant="body2" color="secondary">
                    Boss: {level.Boss.name} - {level.Boss.description}
                  </Typography>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">Keine Levels gefunden.</Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default ViewClass;
