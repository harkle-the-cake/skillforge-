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

    const progresses = res.data;

    // Überprüfen, ob eine Klasse im "leveling-up"-Status ist
    const levelingUpClassProgress = progresses.find((progress) => progress.status === 'leveling-up');

    console.log(levelingUpClassProgress);

    if (levelingUpClassProgress) {
      setLevelingUpClass(levelingUpClassProgress.ClassId);
      console.log(levelingUpClassProgress);

      // Boss-Daten für das nächste Level abrufen, falls erforderlich
      if (levelingUpClassProgress.Class && levelingUpClassProgress.Class.classLevels) {
        const nextLevel = levelingUpClassProgress.Class.classLevels.find(
          (level) => level.levelNumber > levelingUpClassProgress.currentLevel
        );

        console.log("boss???",  levelingUpClassProgress.Class.classLevels);

        const boss = nextLevel?.boss || {
          id: 'pseudo-boss',
          name: 'Quests einreichen',
          description: 'Reiche deine Quests ein. Präsentiere deinem Questgeber deine Ergebnisse.',
          imageUrl: '/images/default_quest_end.png',
        };

        setActiveBoss(boss);
      }
      else
      {
        console.log("no class or levels defined.");
      }
    }

    setClassProgresses(progresses);
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

const handleLevelUp = async (response, classId) => {
  try {
    setActiveBoss(response.boss); // Boss-Info setzen
    setLevelingUpClass(classId); // Die ID der levelnden Klasse speichern

    //console.log('Boss gesetzt:', response.boss); // Debugging
    //console.log('Leveling-Up-Class:', classId); // Debugging
  } catch (error) {
    console.error('Fehler beim Level-Up:', error);
  }
};

  useEffect(() => {
      if (activeBoss && levelingUpClass) {
        console.log('UI aktualisiert: Boss und Leveling-Up-Class sind gesetzt.', {
          activeBoss,
          levelingUpClass,
        });
      }
  }, [activeBoss, levelingUpClass]);


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
    setActiveBoss(null); // Boss zurücksetzen
    setLevelingUpClass(null); // Leveling-Up-Class zurücksetzen
    await fetchClassProgresses(); // Daten neu laden
  } catch (error) {
    console.error('Fehler beim Abschließen des Level-Ups:', error);
  }
};

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
           {classProgresses.map((classData) => {
             //console.log('ClassData ID:', classData.ClassId); // Debug-Ausgabe außerhalb der JSX
             //console.log('Leveling Up ID:', levelingUpClass); // Debug-Ausgabe außerhalb der JSX
             //console.log('Active Boss:', activeBoss);
             return (
               <div key={classData.id} style={{ margin: '5px' }}>
                 {String(classData.ClassId) === String(levelingUpClass) && activeBoss ? (
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
                     onLevelUp={handleLevelUp}
                     onDelete={handleDeleteClass} // Das Löschen wird an ClassStats übergeben
                   />
                 )}
               </div>
             );
           })}
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
