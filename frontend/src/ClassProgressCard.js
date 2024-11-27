import React from 'react';
import { Paper, Box, Typography, Button, LinearProgress, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import QuestProgressSection from './QuestProgressSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Default-Bild für Klassen und Level
const defaultImageClass = '/images/default-class.png';
const defaultImageLevel = '/images/default-level.png';

const ClassProgressCard = ({ classData, onLevelUp, onDelete, onCompleteQuest, token  }) => {
  const { Class, currentLevel, progress } = classData;
  const { classLevels } = Class;
  const progressID = classData.id;
  const classId = Class.id;
  const classImage = Class.imageUrl;
  const className = Class.className;

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Bestimme aktuelles und nächstes Level
  const current = classLevels.find((level) => level.levelNumber === currentLevel) || null;
  const next = classLevels.find((level) => level.levelNumber > currentLevel) || null;
  const levelUpEnabled = (next && progress>=next.requiredXP)? true : false;
  const nextLevelId = next.id;
  const nextLevelXP = next.requiredXP;

  const currentLevelImage = current ? current.imageUrl : defaultImageLevel;
  const nextLevelImage = next ? next.imageUrl : defaultImageLevel;

  const currentLevelName =  current ? current.levelName : "kein Level";
  const nextLevelName = next ? next.levelName : "";

  const currentXP = progress;
  const maxXP = next?next.requiredXP:0;

  return (
    <Paper
      style={{
        height:'400px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        position: 'relative',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >

      <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#fff', borderRadius: '10px' }}>
        {/* 1. Zeile: Titel und Bild */}
        <Box display="flex" alignItems="center" gap={2} marginBottom={2} borderBottom="1px solid #555" pb={2}>
          <img
            src={classImage || defaultImageClass}
            alt="Klassenbild"
            style={{ width: '80px', height: '80px', borderRadius: '10px' }}
          />
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {className}
          </Typography>
         <Button
           variant="contained"
           onClick={() => onDelete(classId)} // onDelete wird von der übergeordneten Komponente bereitgestellt
           style={{ alignSelf: 'flex-start' }}
         >
           <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
         </Button>
        </Box>

        {/* 2. Zeile: Level von/nach */}
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2} borderBottom="1px solid #555" pb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={currentLevelImage || defaultImageLevel}
              alt="Aktuelles Level"
              style={{ width: '50px', height: '50px', borderRadius: '10px' }}
            />
            <Typography variant="body1">{currentLevelName || 'Kein Level'}</Typography>
          </Box>
          <Typography variant="body1">→</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={nextLevelImage || defaultImageLevel}
              alt="Nächstes Level"
              style={{ width: '50px', height: '50px', borderRadius: '10px' }}
            />
            <Typography variant="body1">{nextLevelName || 'Kein nächstes Level'}</Typography>
          </Box>
        </Box>

        {/* 3. Zeile: XP Fortschritt */}
        <Box display="flex" alignItems="center" gap={2}>
          {!levelUpEnabled ? (
            nextLevelName ? (
              <>
                <Typography variant="body1">{currentXP} XP</Typography>
                <Box flexGrow={1}>
                  <LinearProgress
                    variant="determinate"
                    value={(currentXP / maxXP) * 100}
                    style={{
                      height: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#444',
                    }}
                  />
                </Box>
                <Typography variant="body1" style={{ textAlign: 'right' }}>
                  {maxXP} XP
                </Typography>
              </>
            ) : (
              <Typography variant="body1" style={{ flexGrow: 1, textAlign: 'center' }}>
                max
              </Typography>
            )
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onLevelUp(progressID)}
              style={{ marginLeft: '10px', flexGrow: 1 }}
            >
              Level Up
            </Button>
          )}
        </Box>

      </Paper>

      {/* Quests */}
      <QuestProgressSection
        classId={classId}
        token={token}
        currentXP={classData.progress}
        maxXP={nextLevelXP}
        style={{ marginTop: '20px' }}
      />
    </Paper>
  );
};

export default ClassProgressCard;
