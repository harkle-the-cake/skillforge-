import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';

const QuestModal = ({ open, onClose, data, mode, onSave, levelId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(0);
  const [goldReward, setGoldReward] = useState(0);
  const [level, setLevel] = useState('');

  useEffect(() => {
    if (data) {
      setTitle(data.title || '');
      setDescription(data.description || '');
      setXpReward(data.xpReward || 0);
      setGoldReward(data.goldReward || 0);
      setLevel(data.LevelId || '');
    } else {
      setLevel(levelId);
      setTitle('');
      setDescription('');
      setXpReward(0);
      setGoldReward(0);
    }
  }, [data]);

  const handleSave = () => {
    const updatedQuest = {
      ...data,
      title,
      description,
      xpReward: parseInt(xpReward, 10),
      goldReward: parseInt(goldReward, 10),
      LevelId: level
    };

    onSave(updatedQuest); // Übergeordnete Komponente informiert
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {mode === 'add' ? 'Neue Quest hinzufügen' : 'Quest bearbeiten'}
        </Typography>

        <TextField
          label="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          disabled={mode === 'view'}
        />
        <TextField
          label="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          disabled={mode === 'view'}
        />
        <TextField
          label="XP-Belohnung"
          type="number"
          value={xpReward}
          onChange={(e) => setXpReward(e.target.value)}
          fullWidth
          margin="normal"
          disabled={mode === 'view'}
        />
        <TextField
          label="Gold-Belohnung"
          type="number"
          value={goldReward}
          onChange={(e) => setGoldReward(e.target.value)}
          fullWidth
          margin="normal"
          disabled={mode === 'view'}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {mode !== 'view' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Speichern
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            Abbrechen
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default QuestModal;
