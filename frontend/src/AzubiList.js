import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AzubiList = () => {
  const [azubis, setAzubis] = useState([]);

  useEffect(() => {
    // Azubis von der API laden
    const fetchAzubis = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/azubis`);
        setAzubis(res.data);
      } catch (error) {
        console.error('Fehler beim Laden der Azubis:', error);
      }
    };
    fetchAzubis();
  }, []);

  // Azubis nach Jahr gruppieren
  const groupedAzubis = azubis.reduce((acc, azubi) => {
    const year = new Date(azubi.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(azubi);
    return acc;
  }, {});

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Azubis verwalten
      </Typography>
      {Object.keys(groupedAzubis).map((year) => (
        <div key={year}>
          <Typography variant="h6">{year}</Typography>
          <List>
            {groupedAzubis[year].map((azubi) => (
              <ListItem key={azubi.id}>
                <ListItemText primary={azubi.username} />
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to={`/azubi-stats/${azubi.id}`}
                >
                  Stats anzeigen
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    try {
                      await axios.delete(`${API_URL}/api/azubis/${azubi.id}`);
                      setAzubis(azubis.filter(a => a.id !== azubi.id));
                    } catch (error) {
                      console.error('Fehler beim Löschen des Azubis:', error);
                    }
                  }}
                >
                  Löschen
                </Button>
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </div>
  );
};

export default AzubiList;
