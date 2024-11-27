import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Input, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import QuestsSection from './QuestsSection'; // Importiere die QuestsSection-Komponente

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LevelViewModal = ({ open, onClose, data, mode, token }) => {
  const [levelName, setLevelName] = useState('');
  const [levelNumber, setLevelNumber] = useState('');
  const [description, setDescription] = useState('');
  const [requiredXP, setRequiredXP] = useState(0);
  const [bossId, setBossId] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bosses, setBosses] = useState([]);
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    if (data) {
      setLevelName(data.levelName || '');
      setLevelNumber(data.levelNumber || 1);
      setDescription(data.description || '');
      setRequiredXP(data.requiredXP || 0);
      setBossId(data.BossId || null);
      setPreviewUrl(data.imageUrl ? `${API_URL}${data.imageUrl}` : null);

      // Quests abrufen, wenn Level ID vorhanden
      if (data.id) {
        fetchQuests(data.id);
      } else {
        setQuests([]); // Keine Quests für ein neues Level
      }
    }
  }, [data]);

  const fetchQuests = async (levelId) => {
    try {
      const res = await axios.get(`${API_URL}/api/quests/level/${levelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuests(res.data);
    } catch (error) {
      console.error('Fehler beim Abrufen der Quests:', error);
      setQuests([]); // Leeren Zustand setzen bei Fehler
    }
  };

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bosses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBosses(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Bosse:', error);
      }
    };
    fetchBosses();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const updatedLevel = {
        ...data,
        levelName,
        levelNumber,
        description,
        requiredXP,
        BossId: bossId,
      };

      const method = mode === 'add' ? 'POST' : 'PUT';
      const url = mode === 'add'
        ? `${API_URL}/api/levels`
        : `${API_URL}/api/levels/${data.id}`;

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: updatedLevel,
      });

      const savedLevel = response.data;

      // Bild hochladen, falls vorhanden
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await axios.post(`${API_URL}/api/images/levels/${savedLevel.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onClose(); // Schließt das Modal
    } catch (error) {
      console.error('Fehler beim Speichern des Levels:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Titel */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          {mode === 'add' ? 'Neues Level hinzufügen' : 'Level bearbeiten'}
        </Typography>

        {/* Bild und Vorschau */}
        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Level Bild"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '10px',
                objectFit: 'cover',
              }}
            />
          )}
          <Box flex={1}>
            <Input
              type="file"
              onChange={handleImageChange}
              style={{ marginBottom: '10px' }}
              disabled={mode === 'view'}
            />
          </Box>
        </Box>

        {/* Level-Details */}
        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          <TextField
            label="Level-Nummer"
            value={levelNumber}
            onChange={(e) => setLevelNumber(e.target.value)}
            disabled={mode === 'view'}
            fullWidth
          />
          <TextField
            label="Levelname"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            disabled={mode === 'view'}
            fullWidth
          />
          <TextField
            label="Erforderliche XP"
            value={requiredXP}
            onChange={(e) => setRequiredXP(e.target.value)}
            disabled={mode === 'view'}
            fullWidth
          />
        </Box>

        {/* Beschreibung */}
        <TextField
          label="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={mode === 'view'}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {/* Endgegner-Auswahl */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          Endgegner
        </Typography>
        <Select
          value={bossId || ''}
          onChange={(e) => setBossId(e.target.value)}
          disabled={mode === 'view'}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="">Kein Boss</MenuItem>
          {bosses.map((boss) => (
            <MenuItem key={boss.id} value={boss.id}>
              {boss.name}
            </MenuItem>
          ))}
        </Select>

        {/* Quests Section */}
        <QuestsSection
          quests={quests} // Übergebe die geladenen Quests
          token={token}
          levelId={data?.id}
          disabled={!data?.id || mode === 'view'}
        />

        {/* Speichern und Abbrechen */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {mode !== 'view' && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ marginRight: '10px' }}
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
  width: 700,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default LevelViewModal;
