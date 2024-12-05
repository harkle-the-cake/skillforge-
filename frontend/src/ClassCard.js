import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import ClassProgressCard from './ClassProgressCard'; // Rückseite mit Klassenfortschritt
import BossCard from './BossCard'; // Rückseite mit Boss-Ansicht

const ClassCard = ({ classData, token, onDelete, onLevelUp, boss, onDefeat }) => {
  const [flipped, setFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { Class: classInfo, progress: currentXP, status } = classData;
  const isLevelingUp = status === 'leveling-up';

  //console.log("CLASS CARD", classData, isLevelingUp)

  const classImage = imageError
    ? '/images/default-class.png' // Standardbild, wenn das Bild nicht geladen werden kann
    : classInfo.imageUrl || '/images/default-class.png';

  const className = classInfo.className || 'Unbekannte Klasse';

  const containerStyle = {
    width: '400px',
    height: '470px',
    perspective: '1000px',
    margin: '20px auto',
  };

  const cardStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
  };

  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  const frontStyle = {
    ...faceStyle,
    backgroundColor: '#222222',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backStyle = {
    ...faceStyle,
    color: '#fff',
    backgroundColor: '#222222',
    transform: 'rotateY(180deg)',
    padding: '10px',
  };

  const imageStyle = {
    width: '80%',
    height: '60%',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px',
  };

  const xpStyle = {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#333',
  };

  const handleBackClick = (e) => {
    // Verhindere, dass ein Klick auf einen Button die Karte umdreht
    if (e.target.tagName !== 'BUTTON') {
      setFlipped(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Vorderseite */}
        <Paper
          style={frontStyle}
          onClick={() => setFlipped(true)} // Karte umdrehen
        >
          <img
            src={classImage}
            alt={className}
            style={imageStyle}
            onError={() => setImageError(true)} // Standardbild bei Fehler setzen
          />
          <Typography variant="h5">{className}</Typography>
          <Typography style={xpStyle}>{currentXP} XP</Typography>
        </Paper>

        {/* Rückseite */}
        <Paper
          style={backStyle}
          onClick={handleBackClick} // Klick auf die Rückseite
        >
          {isLevelingUp && boss ? (
            // Boss-Ansicht, wenn Level-Up aktiv ist
            <BossCard
              boss={boss}
              classId={classData.ClassId}
              onFight={() => onDefeat(classData.ClassId)}
              token={token}
            />
          ) : (
            // Standard-Rückseite mit Klassenfortschritt
            <ClassProgressCard
              token={token}
              classData={classData}
              onDelete={onDelete}
              onLevelUp={onLevelUp}
            />
          )}
        </Paper>
      </div>
    </div>
  );
};

export default ClassCard;
