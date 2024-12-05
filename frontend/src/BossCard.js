import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BossCard = ({ boss, classId, token, onFight }) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requiredXP, setRequiredXP] = useState(0);

  // Quests laden
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true);
        console.log("loading: ",classId);
        const res = await axios.get(`${API_URL}/api/quest-progress/next-level/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuests(res.data.questProgresses);
        setRequiredXP(res.data.level.requiredXP)
      } catch (error) {
        console.error('Fehler beim Laden der Quests:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchQuests();
  }, [classId, token]);

  // XP berechnen
  const confirmedXP = quests
    .filter((quest) => quest.status === 'confirmed')
    .reduce((sum, quest) => sum + quest.xpEarned, 0);

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '10px',
        textAlign: 'center',
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Boss-Details */}
          <img
            src={boss.imageUrl || '/images/default-boss.png'}
            alt={boss.name}
            style={{ width: '150px', borderRadius: '10px', marginBottom: '10px' }}
          />
          <Typography variant="h5" gutterBottom>
            {boss.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {boss.description}
          </Typography>

          {/* XP-Fortschritt */}
          <Typography variant="body1" gutterBottom>
            {confirmedXP} / {requiredXP} XP
          </Typography>

          {/* Boss-Kampf-Button */}
          <Button
            variant="contained"
            color={confirmedXP >= requiredXP ? 'primary' : 'secondary'}
            disabled={confirmedXP < requiredXP && requiredXP>0}
            onClick={onFight}
          >
            {confirmedXP >= requiredXP ? 'Boss bekämpfen' : 'Nicht bereit'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default BossCard;
