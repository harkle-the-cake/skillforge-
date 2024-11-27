import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  TableContainer,
  Paper,
} from '@mui/material';
import AdminNav from './AdminNav'; // Navigation
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LevelUpManagement = ({ token }) => {
  const [levelUps, setLevelUps] = useState([]);
  const [filteredLevelUps, setFilteredLevelUps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevelUps = async () => {
      try {
        const res = await fetch(`${API_URL}/api/level-ups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setLevelUps(result);
        setFilteredLevelUps(result);
      } catch (error) {
        console.error('Fehler beim Abrufen der Level-Ups:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLevelUps();
  }, [token]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredLevelUps(levelUps);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredLevelUps(
        levelUps.filter((item) =>
          ['User.username', 'Class.className'].some((key) =>
            item[key]?.toString().toLowerCase().includes(lowercasedQuery)
          )
        )
      );
    }
  }, [searchQuery, levelUps]);

  const handleApprove = async (id) => {
    try {
      await fetch(`${API_URL}/api/level-ups/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLevelUps(levelUps.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Fehler beim Bestätigen des Level-Ups:', error);
    }
  };

  return (
    <Box
        style={{ width: '100%' }}
    >
      <AdminNav /> {/* Navigation */}
      <div className="content-area">
        <Typography variant="h4" gutterBottom>
          Level-Up-Verwaltung
        </Typography>

        {/* Suchfeld */}
        <TextField
          label="Suchen..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        <TableContainer
          component={Paper}
          className="custom-table-container" // Stil hinzufügen
        >
          <Table stickyHeader className="custom-table">
            <TableHead>
              <TableRow>
                <TableCell>Azubi</TableCell>
                <TableCell>Klasse</TableCell>
                <TableCell>Aktuelles Level</TableCell>
                <TableCell>Nächstes Level</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="h6" align="center">
                      Laden...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredLevelUps.length > 0 ? (
                filteredLevelUps.map((levelUp) => {
                  const currentLevel = levelUp.Class.levels.find(
                    (l) => l.levelNumber === levelUp.currentLevel
                  );
                  const nextLevel = levelUp.Class.levels.find(
                    (l) => l.levelNumber > levelUp.currentLevel
                  );

                  return (
                    <TableRow key={levelUp.id}>
                      <TableCell>{levelUp.User.username}</TableCell>
                      <TableCell>{levelUp.Class.className}</TableCell>
                      <TableCell>{currentLevel?.levelName || 'Unbekannt'}</TableCell>
                      <TableCell>{nextLevel?.levelName || '-'}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleApprove(levelUp.id)}
                        >
                          <img
                            src="/icons/level_up_icon.png"
                            alt="Bestätigen"
                            style={{ width: '50px' }}
                          />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="h6" align="center">
                      Keine ausstehenden Level-Ups
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default LevelUpManagement;
