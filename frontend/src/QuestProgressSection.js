import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress, Paper, Modal } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const QuestProgressSection = ({ classId, token, currentXP, maxXP, onPrepareLevelUp }) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/quest-progress/next-level/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuests(res.data.questProgresses);
      } catch (error) {
        console.error('Fehler beim Laden der QuestProgress:', error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchQuests();
  }, [classId, token]);

  const handleCompleteQuest = async (questProgressId) => {
    try {
      await axios.put(
        `${API_URL}/api/quest-progress/complete/${questProgressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuests((quests) =>
        quests.map((quest) =>
          quest.Id === questProgressId ? { ...quest, status: 'completed' } : quest
        )
      );
    } catch (error) {
      console.error('Fehler beim Abschließen der Quest:', error);
    }
  };

  const calculateCompletedQuestXP = () => {
    return quests.reduce(
      (sum, quest) => (quest.status === 'completed' ? sum + quest.Quest.xpReward : sum),
      0
    );
  };

  const handlePrepareLevelUp = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/class-progress/${classId}/prepare-level-up`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (onPrepareLevelUp && res.status === 200) {
           onPrepareLevelUp(res.data, classId);
        }

      } catch (error) {
        console.error('Fehler beim Vorbereiten des Level-Ups:', error);
      }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const totalXP = currentXP + calculateCompletedQuestXP();
  const canPrepareLevelUp = totalXP >= maxXP;

  return (
    <>
      <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#fff', marginTop:'20px' }}>
        {/* Überschrift und Button */}
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={1}>
          <Typography variant="h6">Quest-Fortschritt</Typography>
          <Button
            onClick={handleOpenModal}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              borderRadius: '5px',
              padding: '5px 10px',
            }}
          >
            Quests ansehen
          </Button>
        </Box>

        {/* Fortschrittsanzeige oder Button */}
        <Box display="flex" alignItems="center" marginBottom={1}>
          {canPrepareLevelUp ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrepareLevelUp}
              style={{ marginLeft: '10px', flexGrow: 1 }}
            >
              Level-Up vorbereiten
            </Button>
          ) : (
            <>
              <Typography style={{ minWidth: '60px' }}>{totalXP} XP</Typography>
              <Box flex={1} mx={2}>
                <LinearProgress
                  variant="determinate"
                  value={(totalXP / maxXP) * 100}
                  style={{ height: '10px', borderRadius: '5px', backgroundColor: '#444' }}
                />
              </Box>
              <Typography style={{ minWidth: '80px', textAlign: 'right' }}>{maxXP} XP</Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* Modal für Quest-Details */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quests für dieses Level
          </Typography>
          {loading ? (
            <Typography>Laden...</Typography>
          ) : quests.length > 0 ? (
            quests.map((quest) => (
              <Box
                key={quest.QuestId}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="10px"
                padding="10px"
                border="1px solid #555"
                borderRadius="5px"
              >
                <Typography>{quest.Quest.title}</Typography>
                <Typography>{quest.Quest.description}</Typography>
                {quest.status === 'completed' ? (
                  <Typography color="success">Abgeschlossen</Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCompleteQuest(quest.Id)}
                  >
                    Abschließen
                  </Button>
                )}
              </Box>
            ))
          ) : (
            <Typography>Keine Quests verfügbar</Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Schließen
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default QuestProgressSection;
