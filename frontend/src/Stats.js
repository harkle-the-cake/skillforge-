import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import useTokenCheck from './useTokenCheck'; // Importiere die Token-Check-Funktion
import ClassSelection from './ClassSelection';
import ClassStats from './ClassStats';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const IMAGE_URL = API_URL + "/images/";

const Stats = () => {

  useTokenCheck(); // Token auf Gültigkeit prüfen

  const { id } = useParams(); // Optionale ID aus der URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken'); // Token aus dem localStorage holen

  useEffect(() => {
    // Funktion, um die ID aus dem JWT zu extrahieren
    const extractIdFromToken = (token) => {
      try {
        const decodedToken = jwtDecode(token); // Token dekodieren
        return decodedToken.id; // ID aus dem Token extrahieren
      } catch (err) {
        console.error('Fehler beim Dekodieren des Tokens:', err);
        return null;
      }
    };

    const fetchUserStats = async () => {
      const userId = id || extractIdFromToken(token); // Verwende die ID aus der URL oder extrahiere sie aus dem Token

      if (!userId) {
        setError('Ungültige Benutzer-ID.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/azubis/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.error(res.data);
        setUserData(res.data);
        setLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der Daten.');
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [id, token]);

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
              src={IMAGE_URL + userData.avatar}
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
                  src="/icons/gold_icon.png" // Pfad zum Gold-Icon
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

        <ClassStats token={token}/>


        {/* Ausrüstungsbereich */}
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Ausrüstung
          </Typography>
          <Paper style={{ padding: '20px', backgroundColor: '#555', color: '#fff' }}>
            {userData.equipment && userData.equipment.length > 0 ? (
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
