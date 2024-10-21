import React, { useEffect, useState } from 'react';
import { Container, Button, Modal, Box, TextField, Typography } from '@mui/material';
import axios from 'axios';
import CustomTable from './CustomTable';
import AdminNav from './AdminNav';
import { useNavigate } from 'react-router-dom';  // Importiere useNavigate
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AzubiManagement = ({ token }) => {
  const [azubis, setAzubis] = useState([]);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedAzubiId, setSelectedAzubiId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);  // State für das Delete-Modal
  const [azubiToDelete, setAzubiToDelete] = useState(null);  // Speichert den Azubi, der gelöscht werden soll

  const navigate = useNavigate();  // Hook zum Navigieren

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
      }
    };

    fetchAzubis();
  }, [token]);

  // Azubi löschen
  const deleteAzubi = async () => {
    try {
      await axios.delete(`${API_URL}/api/azubis/${azubiToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAzubis(azubis.filter(azubi => azubi.id !== azubiToDelete.id));
      setOpenDeleteModal(false);  // Schließe das Modal nach dem Löschen
    } catch (error) {
      console.error('Fehler beim Löschen des Azubis:', error);
    }
  };

  // Passwort ändern Modal öffnen
  const openPasswordChangeModal = (id) => {
    setSelectedAzubiId(id);
    setOpenPasswordModal(true);
    setErrorMessage('');
  };

  // Passwort ändern
  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwörter stimmen nicht überein.');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/azubis/${selectedAzubiId}/password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpenPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      const updatedAzubis = azubis.map((azubi) => {
        if (azubi.id === selectedAzubiId) {
          return { ...azubi, updatedAt: new Date().toISOString() };
        }
        return azubi;
      });
      setAzubis(updatedAzubis);
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      setErrorMessage('Fehler beim Ändern des Passworts.');
    }
  };

  // Öffnet das Delete-Modal und setzt den ausgewählten Azubi
  const openDeleteConfirmation = (azubi) => {
    setAzubiToDelete(azubi);
    setOpenDeleteModal(true);
  };

  // Aktionen-Buttons rendern (Anzeigen, Bearbeiten, Löschen)
  const renderActions = (azubi) => (
    <div>
      <Button
        onClick={() => navigate(`/azubi/${azubi.id}`)}  // Navigiere zu der View-Seite des Azubis
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => openPasswordChangeModal(azubi.id)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/password_icon.png" alt="Passwort ändern" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => openDeleteConfirmation(azubi)}  // Öffne das Delete-Modal
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
      </Button>
    </div>
  );

  return (
    <Container>
      <AdminNav />
      <div className="content-area">
        <CustomTable
          title="Azubi-Verwaltung"
          columns={[
            { label: 'Benutzername', field: 'username' },
            { label: 'Erstellt', field: 'createdAt' },
            { label: 'Aktualisiert', field: 'updatedAt' }
          ]}
          data={azubis}
          renderActions={renderActions} // Aktionen übergeben
        />
      </div>

      {/* Modal für Passwort-Änderung */}
      <Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <h3>Passwort ändern</h3>
          {errorMessage && (
            <Typography color="error" style={{ marginBottom: '10px' }}>
              {errorMessage}
            </Typography>
          )}
          <TextField
            label="Neues Passwort"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Passwort bestätigen"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={changePassword} variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Passwort ändern
          </Button>
          <Button onClick={() => setOpenPasswordModal(false)} variant="outlined">
            Abbrechen
          </Button>
        </Box>
      </Modal>

      {/* Modal für Löschen */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <h3>Azubi löschen</h3>
          <Typography style={{ marginBottom: '10px' }}>
            Wollen Sie den Azubi <strong>{azubiToDelete?.username}</strong> wirklich löschen?
          </Typography>
          <Button onClick={deleteAzubi} variant="contained" color="primary" style={{ marginRight: '10px' }}>
            Ja
          </Button>
          <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">
            Nein
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

// Stile für das Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default AzubiManagement;
