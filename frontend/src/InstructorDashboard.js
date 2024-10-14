import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Modal, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const InstructorDashboard = ({ token }) => {
  const [azubis, setAzubis] = useState([]);
  const [selectedAzubi, setSelectedAzubi] = useState(null);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAzubis = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/azubis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAzubis(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Azubis:', error);
        navigate('/login');
      }
    };

    fetchAzubis();
  }, [token, navigate]);

  const deleteAzubi = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/azubis/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAzubis(azubis.filter(azubi => azubi.id !== id));
    } catch (error) {
      console.error('Fehler beim Löschen des Azubis:', error);
    }
  };

   // Funktion zum Öffnen des Passwort-Ändern-Modals
    const openPasswordModal = (azubi) => {
      setSelectedAzubi(azubi);
      setPassword1('');
      setPassword2('');
      setMessage('');
      setOpen(true);
    };

    // Funktion zum Schließen des Modals
    const closePasswordModal = () => {
      setOpen(false);
    };

    // Passwortänderung absenden
    const handleChangePassword = async () => {
      if (password1 !== password2) {
        setMessage('Die Passwörter stimmen nicht überein.');
        return;
      }

      try {
        await axios.put(`${API_URL}/api/azubis/${selectedAzubi.id}/password`, {
          newPassword: password1,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage('Passwort erfolgreich geändert.');
        setOpen(false); // Schließe das Modal nach erfolgreicher Änderung
      } catch (error) {
        setMessage('Fehler beim Ändern des Passworts.');
        console.error('Fehler beim Ändern des Passworts:', error);
      }
    };


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>

      {azubis.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Benutzername</TableCell>
              <TableCell>Rolle</TableCell>
              <TableCell>Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {azubis.map((azubi) => (
              <TableRow key={azubi.id}>
                <TableCell>{azubi.username}</TableCell>
                <TableCell>{azubi.role}</TableCell>
                <TableCell>
                  {/* Löschen-Button mit Icon */}
                  <Button
                    onClick={() => deleteAzubi(azubi.id)}
                  >
                    <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '50px', marginRight: '10px' }} />
                  </Button>
                  {/* Anzeigen-Button mit Icon */}
                  <Button
                    onClick={() => navigate(`/azubi/${azubi.id}`)}
                    style={{ marginLeft: '20px' }}
                  >
                    <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '50px', marginRight: '10px' }} />
                  </Button>
                  <Button onClick={() => openPasswordModal(azubi)} style={{ marginLeft: '20px' }}>
                     <img src="/icons/password_icon.png" alt="Passwort ändern" style={{ width: '50px', marginRight: '10px' }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body1">Keine Azubis gefunden.</Typography>
      )}

      {/* Modal zum Ändern des Passworts */}
      <Modal open={open} onClose={closePasswordModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Passwort für {selectedAzubi?.username} ändern
          </Typography>
          <TextField
            label="Neues Passwort"
            type="password"
            fullWidth
            margin="normal"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <TextField
            label="Passwort bestätigen"
            type="password"
            fullWidth
            margin="normal"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {message && (
            <Typography color="error" style={{ marginTop: '10px' }}>
              {message}
            </Typography>
          )}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={closePasswordModal} style={{ marginRight: '10px' }}>Abbrechen</Button>
            <Button variant="contained" onClick={handleChangePassword}>Speichern</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default InstructorDashboard;
