import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import useTokenCheck from './useTokenCheck'; // Importiere die Token-Check-Funktion

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Stats = () => {

  useTokenCheck(); // Token auf Gültigkeit prüfen

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken'); // Token aus dem localStorage holen

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Daten.');
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [token]);

  if (loading) {
    return <Typography>Laden...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container style={{ paddingTop: '20px' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Avatar links */}
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <img
              src={API_URL + userData.avatar}
              alt="Avatar"
              style={{ borderRadius: '50%', width: '150px', height: '150px' }}
            />
          </Box>
        </Grid>

        {/* Name und Gold rechts */}
        <Grid item xs={12} md={8}>
          <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#fff' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h4">{userData.username}</Typography>
              <Box display="flex" alignItems="center">
                <img
                  src="/images/gold_icon.png" // Pfad zum Gold-Icon
                  alt="Gold Icon"
                  style={{ width: '50px', marginRight: '10px' }} // Größeres Icon
                />
                <Typography variant="h5" style={{ color: '#ffd700' }}>
                  {userData.gold}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Klassenbereich */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Deine Klassen
          </Typography>
          <Paper style={{ padding: '20px', backgroundColor: '#555', color: '#fff' }}>
            {userData.classes.length > 0 ? (
              <Grid container spacing={2}>
                {userData.classes.map((classData) => (
                  <Grid item xs={12} sm={6} md={4} key={classData.className}>
                    <Paper style={{ padding: '20px', backgroundColor: '#333', color: '#fff' }}>
                      <Typography variant="h5">{classData.className}</Typography>
                      <Typography variant="h6">Level: {classData.level}</Typography>
                      <Typography variant="h6">XP: {classData.xp}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="h6">Keine Klasse</Typography>
            )}
          </Paper>
        </Grid>

        {/* Ausrüstungsbereich */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Ausrüstung
          </Typography>
          <Paper style={{ padding: '20px', backgroundColor: '#555', color: '#fff' }}>
            {userData.equipment.length > 0 ? (
              <ul>
                {userData.equipment.map((item, index) => (
                  <li key={index}>
                    <Typography variant="h6">{item}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="h6">Keine Ausrüstung</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Stats;
