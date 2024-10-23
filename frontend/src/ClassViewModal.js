import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import useMediaQuery from '@mui/material/useMediaQuery';
import './App.css';

const ClassViewModal = ({ open, onClose, classData, mode, onSave }) => {
  const [className, setClassName] = useState('');
  const [levels, setLevels] = useState([]);
  const [xpMethod, setXpMethod] = useState('linear');

  const isMobile = useMediaQuery('(max-width:600px)'); // Check for mobile

  useEffect(() => {
    if (classData) {
      setClassName(classData.className || '');
      setLevels(classData.levels || []);
    }
  }, [classData]);

  const calculateXP = (levelNumber) => {
    if (xpMethod === 'linear') {
      return levelNumber * 100;
    } else if (xpMethod === 'steigend') {
      return Math.floor(300 * (Math.pow(2, levelNumber - 1) - 1));
    }
    return 0;
  };

  const handleSave = () => {
    const updatedClass = {
      ...classData,
      className,
      levels,
    };
    onSave(updatedClass);
    onClose();
  };

  const addLevel = () => {
    const maxLevelNumber = levels.length > 0 ? Math.max(...levels.map(l => parseInt(l.levelNumber))) : 0;
    const newLevelNumber = maxLevelNumber + 1;
    const newXP = calculateXP(newLevelNumber);
    setLevels([...levels, { levelNumber: newLevelNumber, levelName: '', description: '', requiredXP: newXP }]);
  };

  const handleLevelChange = (index, field, value) => {
    const updatedLevels = [...levels];
    updatedLevels[index][field] = value;
    setLevels(updatedLevels);
  };

  const deleteLevel = (index) => {
    let updatedLevels = levels.filter((_, i) => i !== index);

    updatedLevels = updatedLevels.map((level, i) => ({
      ...level,
      levelNumber: i + 1,
      requiredXP: calculateXP(i + 1),
    }));

    setLevels(updatedLevels);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedLevels = Array.from(levels);
    const [removed] = reorderedLevels.splice(result.source.index, 1);
    reorderedLevels.splice(result.destination.index, 0, removed);

    const updatedLevels = reorderedLevels.map((level, i) => ({
      ...level,
      levelNumber: i + 1,
      requiredXP: calculateXP(i + 1),
    }));

    setLevels(updatedLevels);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={isMobile ? mobileModalStyle : modalStyle}>
        <Typography variant="h6" gutterBottom>
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

        <Typography variant="h6" style={{ marginTop: '20px' }}>Levels</Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="levels">
            {(provided) => (
              <TableContainer component={Paper} style={{ marginBottom: '10px', maxHeight: '300px', overflowY: 'auto' }} ref={provided.innerRef} {...provided.droppableProps}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Levelname</TableCell>
                      <TableCell>Beschreibung</TableCell>
                      {mode !== 'view' && <TableCell>Aktionen</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {levels.length > 0 ? (
                      levels.map((level, index) => (
                        <Draggable key={index} draggableId={`${index}`} index={index}>
                          {(provided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TableCell>
                                {/* Name editierbar */}
                                <TextField
                                  value={level.levelName}
                                  onChange={(e) => handleLevelChange(index, 'levelName', e.target.value)}
                                  disabled={mode === 'view'}
                                  size="small"
                                  fullWidth
                                />
                                {/* Nummer und XP unterhalb des Namens */}
                                <Typography variant="caption" display="block">
                                  Level {level.levelNumber}, XP: {level.requiredXP}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={level.description}
                                  onChange={(e) => handleLevelChange(index, 'description', e.target.value)}
                                  disabled={mode === 'view'}
                                  size="small"
                                  fullWidth
                                />
                              </TableCell>
                              {mode !== 'view' && (
                                <TableCell>
                                  <Button
                                      onClick={() => deleteLevel(index)}
                                      style={{ marginRight: '10px' }}
                                    >
                                      <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
                                    </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={mode !== 'view' ? 3 : 2} align="center">
                          Keine Level hinzugefügt
                        </TableCell>
                      </TableRow>
                    )}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Droppable>
        </DragDropContext>

        {mode !== 'view' && (
          <Button variant="contained" color="primary" onClick={addLevel} style={{ marginTop: '10px' }}>
            Neues Level hinzufügen
          </Button>
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

// Stile für das Modal im mobilen Bereich
const mobileModalStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '0',
};

// Stile für das Modal im Desktop-Bereich
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  minHeight: 600,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default ClassViewModal;
