import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Tab, Tabs, Input } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ViewModal = ({ open, onClose, data, mode, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setDescription(data.description || '');
      setPreviewUrl(data.imageUrl ? `${API_URL}${data.imageUrl}` : null);

      // Levels sortiert nach levelNumber setzen
      const sortedLevels = (data.levels || []).slice().sort((a, b) => a.levelNumber - b.levelNumber);
      setLevels(sortedLevels);
    }
  }, [data]);

  const handleSave = () => {
    const updatedClass = { ...data, name, description, image };
    onSave(updatedClass);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
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
              {mode === 'view' ? 'Boss anzeigen' : mode === 'edit' ? 'Boss bearbeiten' : 'Neuen Boss hinzufügen'}
            </Typography>
            <TextField
              label="Bezeichnung"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
  height: '400px',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default ViewModal;
