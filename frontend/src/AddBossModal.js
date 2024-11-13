import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AddBossModal = ({ open, onClose, onBossAdd, token }) => {
  const [bossName, setBossName] = useState('');
  const [bossDescription, setBossDescription] = useState('');
  const handleSaveBoss = async () => {
    try {
      const newBoss = { name: bossName, description: bossDescription };
      const res = await axios.post(`${API_URL}/api/bosses`, newBoss, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onBossAdd(res.data); // Fügt den neuen Boss zur Liste hinzu
      onClose(); // Modal schließen
    } catch (error) {
      console.error('Fehler beim Speichern des Bosses:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Neuen Boss hinzufügen</Typography>

        <TextField
          label="Name des Bosses"
          value={bossName}
          onChange={(e) => setBossName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Beschreibung"
          value={bossDescription}
          onChange={(e) => setBossDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <Button variant="contained" color="primary" onClick={handleSaveBoss}>
          Boss hinzufügen
        </Button>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default AddBossModal;
