import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, Typography, Box } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassSelection = ({ token, onClassAdded  }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Klassen:', error);
      }
    };

    fetchClasses();
  }, [token]);


  const handleSelectClass = async () => {
    if (!selectedClassId) {
      alert('Bitte wählen Sie eine Klasse aus.');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/class-progress`,
        { classId: selectedClassId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onClassAdded) onClassAdded(); // Callback auslösen

    } catch (error) {
      console.error('Fehler beim Hinzufügen des Klassenfortschritts:', error);
      alert('Fehler beim Auswählen der Klasse.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '15px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
      }}
    >
      <Typography
        variant="h5"
        sx={{ color: '#fff', fontWeight: 'bold', flexShrink: 0 }}
      >
        Neue Klasse:
      </Typography>
      <Select
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
        displayEmpty
        sx={{
          minWidth: '200px',
          maxHeight: '40px',
          background: '#444',
          color: '#fff',
          borderRadius: '5px',
          '& .MuiSelect-icon': { color: '#fff' },
        }}
      >
        <MenuItem value="" disabled>
          Bitte wählen...
        </MenuItem>
        {classes.map((cls) => (
          <MenuItem key={cls.id} value={cls.id}>
            {cls.className}
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        onClick={handleSelectClass}
        sx={{
          fontWeight: 'bold',
          '&:hover': {
            background: 'linear-gradient(135deg, #8e24aa, #9c27b0)',
          },
        }}
      >
        <img src="/icons/create_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
      </Button>
    </Box>
  );
};

export default ClassSelection;
