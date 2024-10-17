import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, TextField, Grid, Paper } from '@mui/material';
import AdminNav from './AdminNav';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LevelManagement = ({ token, classId }) => {
  const [levels, setLevels] = useState([]);
  const [newLevelData, setNewLevelData] = useState({
    levelNumber: '',
    description: '',
    requiredXP: '',
  });
  const [editLevelId, setEditLevelId] = useState(null);
  const [editLevelData, setEditLevelData] = useState({
    levelNumber: '',
    description: '',
    requiredXP: '',
  });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/levels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLevels(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Level:', error);
      }
    };

    fetchLevels();
  }, [token, classId]);

  const handleCreateLevel = async () => {
    if (newLevelData.levelNumber && newLevelData.description && newLevelData.requiredXP) {
      try {
        const res = await axios.post(`${API_URL}/api/levels`, {
          ...newLevelData,
          classId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLevels([...levels, res.data]);
        setNewLevelData({ levelNumber: '', description: '', requiredXP: '' });
      } catch (error) {
        console.error('Fehler beim Anlegen des Levels:', error);
      }
    }
  };

  const handleEditLevel = async (levelId) => {
    if (editLevelData.levelNumber && editLevelData.description && editLevelData.requiredXP) {
      try {
        await axios.put(`${API_URL}/api/levels/${levelId}`, {
          ...editLevelData,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLevels(levels.map((lvl) => (lvl.id === levelId ? { ...lvl, ...editLevelData } : lvl)));
        setEditLevelId(null);
        setEditLevelData({ levelNumber: '', description: '', requiredXP: '' });
      } catch (error) {
        console.error('Fehler beim Bearbeiten des Levels:', error);
      }
    }
  };

  const handleDeleteLevel = async (levelId) => {
    try {
      await axios.delete(`${API_URL}/api/levels/${levelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLevels(levels.filter((lvl) => lvl.id !== levelId));
    } catch (error) {
      console.error('Fehler beim Löschen des Levels:', error);
    }
  };

  return (
    <Container>
      {/* Navigation für Ausbilder */}
      <AdminNav />
      <Typography variant="h4" gutterBottom>Levelverwaltung</Typography>

      {/* Neues Level erstellen */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <TextField
            label="Level-Nummer"
            variant="outlined"
            fullWidth
            value={newLevelData.levelNumber}
            onChange={(e) => setNewLevelData({ ...newLevelData, levelNumber: e.target.value })}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            label="Beschreibung"
            variant="outlined"
            fullWidth
            value={newLevelData.description}
            onChange={(e) => setNewLevelData({ ...newLevelData, description: e.target.value })}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Erforderliche XP"
            variant="outlined"
            fullWidth
            value={newLevelData.requiredXP}
            onChange={(e) => setNewLevelData({ ...newLevelData, requiredXP: e.target.value })}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" onClick={handleCreateLevel}>
            {/* Erstellen-Icon */}
            <img src="/icons/create_icon.png" alt="Erstellen" style={{ width: '30px' }} />
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Vorhandene Level</Typography>

      {/* Vorhandene Level */}
      {levels.map((lvl) => (
        <Paper key={lvl.id} style={{ padding: '10px', marginBottom: '10px' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={3}>
              {editLevelId === lvl.id ? (
                <TextField
                  fullWidth
                  value={editLevelData.levelNumber}
                  onChange={(e) => setEditLevelData({ ...editLevelData, levelNumber: e.target.value })}
                />
              ) : (
                <Typography>{lvl.levelNumber}</Typography>
              )}
            </Grid>
            <Grid item xs={5}>
              {editLevelId === lvl.id ? (
                <TextField
                  fullWidth
                  value={editLevelData.description}
                  onChange={(e) => setEditLevelData({ ...editLevelData, description: e.target.value })}
                />
              ) : (
                <Typography>{lvl.description}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              {editLevelId === lvl.id ? (
                <TextField
                  fullWidth
                  value={editLevelData.requiredXP}
                  onChange={(e) => setEditLevelData({ ...editLevelData, requiredXP: e.target.value })}
                />
              ) : (
                <Typography>{lvl.requiredXP}</Typography>
              )}
            </Grid>
            <Grid item xs={1}>
              {editLevelId === lvl.id ? (
                <Button variant="contained" color="secondary" onClick={() => handleEditLevel(lvl.id)}>
                  {/* Speichern-Icon */}
                  <img src="/icons/save_icon.png" alt="Speichern" style={{ width: '30px' }} />
                </Button>
              ) : (
                <>
                  <Button onClick={() => setEditLevelId(lvl.id)}>
                    {/* Bearbeiten-Icon */}
                    <img src="/icons/edit_icon.png" alt="Bearbeiten" style={{ width: '30px' }} />
                  </Button>
                  <Button onClick={() => handleDeleteLevel(lvl.id)}>
                    {/* Löschen-Icon */}
                    <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '30px' }} />
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Container>
  );
};

export default LevelManagement;
