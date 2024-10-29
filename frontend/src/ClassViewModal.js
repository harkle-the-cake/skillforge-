import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Tab, Tabs, Input } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassViewModal = ({ open, onClose, classData, mode, onSave }) => {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // console.log(classData);

  useEffect(() => {
    if (classData) {
      setClassName(classData.className || '');
      setDescription(classData.description || '');
      setPreviewUrl(classData.imageUrl ? `${API_URL}${classData.imageUrl}` : null);

      // Levels sortiert nach levelNumber setzen
      const sortedLevels = (classData.levels || []).slice().sort((a, b) => a.levelNumber - b.levelNumber);
      setLevels(sortedLevels);
    }
  }, [classData]);

  const handleSave = () => {
    const updatedClass = { ...classData, className, description, levels, image };
    onSave(updatedClass);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const addLevel = () => {
    const newLevelNumber = levels.length + 1;
    const newLevel = { levelNumber: newLevelNumber, levelName: '', description: '', requiredXP: '', boss: null, image: null };
    setLevels([...levels, newLevel]);
    setSelectedTab(levels.length);
  };

  // Level löschen und Nummerierung anpassen
  const deleteLevel = (index) => {
    const updatedLevels = levels.filter((_, i) => i !== index)
      .map((level, i) => ({ ...level, levelNumber: i + 1 })); // Nummerierung anpassen
    setLevels(updatedLevels);
    setSelectedTab(Math.max(0, index - 1)); // Tab wechseln, falls das aktive Level gelöscht wird
  };

  const handleLevelChange = (index, field, value) => {
    const updatedLevels = [...levels];
    updatedLevels[index] = { ...updatedLevels[index], [field]: value };
    setLevels(updatedLevels);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div style={{ textAlign: 'center',maxWidth: '200px', borderRadius: '10px'  }}>
              {previewUrl && <img src={previewUrl} alt="Class preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '10px' }} />}
              {mode !== 'view' && (
                <>
                  <Input type="file" onChange={handleImageChange} style={{ marginTop: '5px' }} />
                </>
              )}
           </div>
          <div style={{ flex: 1 }}>
            <Typography variant="h6">
              {mode === 'view' ? 'Klasse anzeigen' : mode === 'edit' ? 'Klasse bearbeiten' : 'Neue Klasse hinzufügen'}
            </Typography>
            <TextField
              label="Klassenname"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              disabled={mode === 'view'}
              fullWidth
              margin="normal"
            />
          </div>

        </div>

        <TextField
              label="Beschreibung"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={mode === 'view'}
              fullWidth
              multiline
              rows={3}
              margin="normal"
        />

        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="Level Tabs">
          {levels.map((level, index) => (
            <Tab label={`Level ${level.levelNumber || index + 1}`} key={index} />
          ))}
          {mode !== 'view' && (
            <Button variant="contained" color="primary" onClick={addLevel} style={{ marginLeft: '10px' }}>
              <img src="/icons/create_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
            </Button>
          )}
        </Tabs>

        {levels[selectedTab] && (
          <Box sx={{ padding: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px'}}>
                <TextField
                  label="Levelname"
                  value={levels[selectedTab].levelName}
                  onChange={(e) => handleLevelChange(selectedTab, 'levelName', e.target.value)}
                  disabled={mode === 'view'}
                  fullWidth
                  margin="normal"
                />

                {mode !== 'view' && (
                  <Button onClick={() => deleteLevel(selectedTab)}>
                    Löschen
                  </Button>
                )}
            </Box>


            <TextField
              label="Beschreibung"
              value={levels[selectedTab].description}
              onChange={(e) => handleLevelChange(selectedTab, 'description', e.target.value)}
              disabled={mode === 'view'}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
            <TextField
              label="Erforderliche XP"
              value={levels[selectedTab].requiredXP}
              onChange={(e) => handleLevelChange(selectedTab, 'requiredXP', e.target.value)}
              disabled={mode === 'view'}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Endgegner"
              value={levels[selectedTab].boss || ''}
              onChange={(e) => handleLevelChange(selectedTab, 'boss', e.target.value)}
              disabled={mode === 'view'}
              fullWidth
              margin="normal"
            />
          </Box>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          {mode !== 'view' && (
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
              Speichern
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            Abbrechen
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default ClassViewModal;
