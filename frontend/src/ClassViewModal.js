import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Tab, Tabs, Input,Select, MenuItem } from '@mui/material';
import axios from 'axios';
import './ClassViewModal.css';
import AddBossModal from './AddBossModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassViewModal = ({
  open,
  onClose,
  data,
  fields,
  title,
  token,
  mode,
  onSave,
  dropdownOptions = {},
}) => {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bosses, setBosses] = useState([]); // Liste aller Bosse für die Auswahl
  const [showBossModal, setShowBossModal] = useState(false); // Status für das Boss-Modal


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


  useEffect(() => {
    if (data) {
      setClassName(data.className || '');
      setDescription(data.description || '');
      setPreviewUrl(data.imageUrl ? `${API_URL}${data.imageUrl}` : null);

      // Levels sortiert nach levelNumber setzen
      const sortedLevels = (data.levels || []).slice().sort((a, b) => a.levelNumber - b.levelNumber);
      setLevels(sortedLevels.map(level => ({ ...level, BossId: level.BossId || null })));
    }
  }, [data]);

  //console.log(classData);

  const handleSave = () => {
      const updatedLevels = levels.map((level) => ({
        ...level,
        bossId: level.bossId || null, // Sicherstellen, dass bossId gesetzt ist
      }));

      const updatedClass = {
        ...data,
        className,
        description,
        levels: updatedLevels, // Stellen Sie sicher, dass levels das `bossId` enthält
        image,
      };

      onSave(updatedClass);
      onClose();
  };

  // Level-Boss-Änderungshandler
  const handleBossChange = (index, bossId) => {
      console.log(index);
      console.log(bossId);
      const updatedLevels = [...levels];
      updatedLevels[index].BossId = bossId;
      console.log(updatedLevels);
      setLevels(updatedLevels);
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

  // Öffnet das Modal und prüft, ob das token existiert
  const openAddBossModal = () => {
    if (token) {
      setShowBossModal(true);
    } else {
      console.error('Token ist undefined');
    }
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
                  label="XP"
                  className="levelXP"
                  value={levels[selectedTab].requiredXP}
                  onChange={(e) => handleLevelChange(selectedTab, 'requiredXP', e.target.value)}
                  disabled={mode === 'view'}
                  margin="normal"
                />
                <TextField
                  label="Levelname"
                  className="levelName"
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

            <Box
              sx={{
                padding: '10px',
                marginTop: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                opacity: mode === 'view' ? 0.6 : 1, // Bereich ausgrauen im Read-Modus
                pointerEvents: mode === 'view' ? 'none' : 'auto' // Interaktion deaktivieren im Read-Modus
              }}
            >
              <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Endgegner
              </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Boss Dropdown */}
                    <Select
                      value={levels[selectedTab].BossId || ''}
                      onChange={(e) => handleBossChange(selectedTab, e.target.value)}
                      displayEmpty
                      fullWidth
                      disabled={mode === 'view'}
                    >
                      <MenuItem value="">Kein Endgegner</MenuItem>
                      {bosses.map((boss) => (
                        <MenuItem key={boss.id} value={boss.id}>{boss.name}</MenuItem>
                      ))}
                    </Select>

                    {/* Add Button für neuen Boss, nur sichtbar im Bearbeitungsmodus */}
                    {mode !== 'view' && (
                        <Button onClick={openAddBossModal} variant="contained" color="primary" style={{ minWidth: '40px', padding: '5px' }}>
                            <img src="/icons/create_icon.png" alt="Add Boss" style={{ width: '20px', height: '20px' }} />
                        </Button>
                    )}
                  </Box>

                {showBossModal && (
                  <AddBossModal
                    open={showBossModal}
                    onClose={() => setShowBossModal(false)}
                    onBossAdd={(newBoss) => {
                      setBosses([...bosses, newBoss]);
                      // Setzen Sie den neu hinzugefügten Boss als ausgewählten Boss für das aktuelle Level
                      handleBossChange(selectedTab, newBoss.id);
                    }}
                    token={token}  // Token korrekt übergeben
                  />
                )}

                {/* Boss-Details anzeigen */}
                {levels[selectedTab].BossId && (
                  <Box sx={{ marginTop: '10px' }}>
                    <Typography variant="body2">Beschreibung: {bosses.find((boss) => boss.id === levels[selectedTab].BossId)?.description}</Typography>
                  </Box>
                )}
              </Box>
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
