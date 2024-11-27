import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import ClassSelection from './ClassSelection'; // Component for adding new classes
import ClassProgressCard from './ClassProgressCard'; // Component for adding new classes
import BossCard from './BossCard'; // Import der BossCard


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassStats = ({ token }) => {
  const [classProgresses, setClassProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [activeBoss, setActiveBoss] = useState(null);
  const [levelingUpClass, setLevelingUpClass] = useState(null);

  // Klassenfortschritt abrufen
  const fetchClassProgresses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/class-progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassProgresses(res.data);
    } catch (error) {
      console.error('Fehler beim Abrufen des Klassenfortschritts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassProgresses();
  }, []);

  const handleClassAdded = () => {
    fetchClassProgresses(); // Reload the class progresses after a new class is added
  };

 const handleLevelUp = async (classProgressId) => {
   try {
     const response = await axios.put(
       `${API_URL}/api/class-progress/${classProgressId}/level-up`,
       {},
       { headers: { Authorization: `Bearer ${token}` } }
     );
     setActiveBoss(response.data); // Boss-Info setzen
     setLevelingUpClass(classProgressId); // Die ID der levelnden Klasse speichern
     console.log(activeBoss);
   } catch (error) {
     console.error('Fehler beim Level-Up:', error);
   }
 };

    const handleDeleteClass = (classId) => {
      setClassToDelete(classId);
      setDeleteDialogOpen(true);
    };

    const confirmDeleteClass = async () => {
      try {
        await axios.delete(`${API_URL}/api/class-progress/${classToDelete}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClassProgresses(classProgresses.filter((progress) => progress.Class.id !== classToDelete));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error('Fehler beim Löschen der Klasse:', error);
      }
    };

  const handleCompleteQuest = async (questId) => {
    try {
      await axios.put(`${API_URL}/api/quest-progress/${questId}`, { status: 'completed' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClassProgresses(); // Aktualisiere die Daten nach dem Abschluss der Quest
    } catch (error) {
      console.error('Fehler beim Abschließen der Quest:', error);
    }
  };


  const handleCloseDeleteDialog = () => {
    setClassToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleBossDefeat = async () => {
      try {
        await axios.put(
          `${API_URL}/api/class-progress/${levelingUpClass}/complete-level-up`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActiveBoss(null);
        setLevelingUpClass(null);
        fetchClassProgresses(); // Aktualisiere die Klassenfortschritte
      } catch (error) {
        console.error('Fehler beim Abschließen des Level-Ups:', error);
      }
  };

  console.log(classProgresses);

  return (
    <Grid item xs={12}>
      <Typography variant="h4" gutterBottom>
        Deine Klassen
      </Typography>
      <Paper style={{ padding: '20px', backgroundColor: '#555', color: '#fff' }}>
        {loading ? (
          <Typography variant="h6">Laden...</Typography>
        ) : classProgresses && classProgresses.length > 0 ? (
          <Grid container spacing={2}>
            {classProgresses.map((classData) => (
                <div key={classData.id} style={{ margin: '5px'}}>
                {
                  classData.id === levelingUpClass && activeBoss ? (
                    <BossCard
                        key={activeBoss.id}
                        boss={activeBoss}
                        onDefeat={handleBossDefeat}
                    />
                  ) : (
                    <ClassProgressCard
                      token={token}
                      key={classData.id}
                      classData={classData}
                      onLevelUp={(id) => handleLevelUp(id)}
                      onDelete={handleDeleteClass} // Das Löschen wird an ClassStats übergeben
                      onCompleteQuest={handleCompleteQuest}
                    />
                  )
                }
                </div>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6">Keine Klasse</Typography>
        )}

        {/* ClassSelection-Komponente mit Callback für Reload */}
        <ClassSelection token={token} onClassAdded={handleClassAdded} />

        {/* Bestätigungsdialog für das Löschen */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Klasse löschen</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sind Sie sicher, dass Sie die Klasse löschen möchten? Dies kann nicht rückgängig gemacht werden.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Abbrechen
            </Button>
            <Button onClick={confirmDeleteClass} color="error" variant="contained">
              Löschen
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Grid>
  );
};

export default ClassStats;
