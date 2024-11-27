import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import QuestModal from './QuestModal'; // Modal für Bearbeiten/Hinzufügen von Quests

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const QuestsSection = ({ quests, levelId, token, mode }) => {
  const [localQuests, setLocalQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null); // Für Modal
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
      // Quests aktualisieren, wenn sich die Props ändern
      setLocalQuests(quests);
  }, [quests]);

  // Quest hinzufügen oder bearbeiten
  const handleSaveQuest = async (quest) => {
    try {
      const method = quest.id ? 'PUT' : 'POST';
      const url = quest.id
        ? `${API_URL}/api/quests/${quest.id}`
        : `${API_URL}/api/quests`;

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: quest,
      });

      if (quest.id) {
        // Bestehende Quest aktualisieren
        setLocalQuests((prevQuests) =>
          prevQuests.map((q) => (q.id === response.data.id ? response.data : q))
        );
      } else {
        // Neue Quest hinzufügen
        setLocalQuests((prevQuests) => [...prevQuests, response.data]);
      }

      setModalOpen(false); // Modal schließen
    } catch (error) {
      console.error('Fehler beim Speichern der Quest:', error);
    }
  };

  // Quest löschen
  const handleDeleteQuest = async (questId) => {
    try {
      await axios.delete(`${API_URL}/api/quests/${questId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Quest aus der Liste entfernen
      setLocalQuests((prevQuests) => prevQuests.filter((quest) => quest.id !== questId));
    } catch (error) {
      console.error('Fehler beim Löschen der Quest:', error);
    }
  };

  // Modal-Logik
  const openModal = (quest) => {
    setSelectedQuest(quest); // Bestehende Quest oder neue Quest
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedQuest(null);
    setModalOpen(false);
  };

  return (
    <Box style={{ marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Quests
      </Typography>
      {localQuests.length > 0 ? (
        localQuests.map((quest) => (
          <Accordion key={quest.id} disableGutters>
            <AccordionSummary
              expandIcon={
                <img
                  src={`${API_URL}/icons/expand_icon.png`}
                  alt="Expand"
                  style={{ width: '20px', height: '20px' }}
                />
              }
              aria-controls={`panel-${quest.id}-content`}
              id={`panel-${quest.id}-header`}
            >
              <Typography>{quest.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{quest.description}</Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop="10px"
              >
                <Typography>
                  XP: {quest.xpReward} | Gold: {quest.goldReward}
                </Typography>
                {mode !== 'view' && (
                  <Box>
                    <IconButton color="primary" onClick={() => openModal(quest)}>
                      <img
                        src={`${API_URL}/icons/edit_icon.png`}
                        alt="Edit"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteQuest(quest.id)}
                    >
                      <img
                        src={`${API_URL}/icons/delete_icon.png`}
                        alt="Delete"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body2">Keine Quests hinzugefügt.</Typography>
      )}
    {mode !== 'view' && (
      <>
        {levelId ? (
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            sx={{ mb: 2 }}
          >
            Neue Quest hinzufügen
          </Button>
        ) : (
          <Typography color="error" sx={{ mb: 2 }}>
            Speichern Sie das Level, bevor Sie Quests hinzufügen.
          </Typography>
        )}
      </>
    )}


      {/* Modal für Quest-Bearbeitung/Hinzufügen */}
      {modalOpen && (
        <QuestModal
          levelId={levelId}
          open={modalOpen}
          onClose={closeModal}
          onSave={handleSaveQuest}
          quest={selectedQuest}
        />
      )}
    </Box>
  );
};

export default QuestsSection;
