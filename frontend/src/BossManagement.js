import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import axios from 'axios';
import CustomTable from './CustomTable';
import AdminNav from './AdminNav';
import ViewModal from './ViewModal'; // Importiere das Modal für Ansicht, Bearbeitung und Hinzufügen
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const BossManagement = ({ token }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Klassen vom Server abrufen
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bosses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Klassen:', error);
      }
    };

    fetchClasses();
  }, [token]);

  // Klassenansicht Modal öffnen
  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
    setOpenModal(true);
  };

  // Bearbeiten Modal öffnen
  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setOpenModal(true);
  };

  // Hinzufügen Modal öffnen
  const handleAdd = () => {
    setSelectedItem({ name: '', description: '' }); // Leere Klasse initialisieren
    setModalMode('add');
    setOpenModal(true);
  };

  // Klasse speichern
  const handleSave = async (updatedItem) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedItem.name);
      formData.append('description', updatedItem.description);
      if (updatedItem.image) formData.append('image', updatedItem.image);

      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

      if (modalMode === 'add') {
        const res = await axios.post(`${API_URL}/api/bosses`, formData, config);
        setItems([...updatedItem, res.data]);
      } else if (modalMode === 'edit') {
        const res = await axios.put(`${API_URL}/api/bosses/${selectedItem.id}`, formData, config);
        setItems(items.map((cls) => (cls.id === selectedItem.id ? res.data : cls))); // Antwort des Servers verwenden
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Klasse:', error);
    }
  };

  // Modal schließen
  const handleCloseModal = () => {
    setSelectedItem(null);
    setOpenModal(false);
  };

  // Lösch-Modal öffnen
  const handleOpenDeleteModal = (classItem) => {
    setItemToDelete(classItem);
    setOpenDeleteModal(true);
  };

  // Lösch-Modal schließen
  const handleCloseDeleteModal = () => {
    setItemToDelete(null);
    setOpenDeleteModal(false);
  };

  // Klasse löschen
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/classes/${itemToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((cls) => cls.id !== itemToDelete.id));
      handleCloseDeleteModal(); // Modal schließen nach dem Löschen
    } catch (error) {
      console.error('Fehler beim Löschen der Klasse:', error);
    }
  };

  // Aktionen-Buttons rendern (Anzeigen, Bearbeiten, Löschen)
  const renderActions = (item) => (
    <div>
      <Button onClick={() => handleView(item)} style={{ marginRight: '10px' }}>
        <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '25px' }} />
      </Button>
      <Button onClick={() => handleEdit(item)} style={{ marginRight: '10px' }}>
        <img src="/icons/edit_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => handleOpenDeleteModal(item)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
      </Button>
    </div>
  );

  // Spalten für die Tabelle definieren
  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'Boss-Name' },
    { field: 'description', label: 'Beschreibung' },
  ];

  return (
    <Container>
      <AdminNav />
      <div className="content-area">
        <CustomTable
          title="Boss-Verwaltung"
          columns={columns}
          data={items}
          renderActions={renderActions}
          addFunction={handleAdd} // Add-Button zum Hinzufügen einer neuen Klasse
        />
      </div>

      {/* Modal zum Anzeigen, Bearbeiten oder Hinzufügen der Klasse */}
      <ViewModal
        open={openModal}
        onClose={handleCloseModal}
        classData={selectedItem}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Modal für das Löschen einer Klasse */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Möchten Sie die Klasse <strong>{itemToDelete?.name}</strong> wirklich löschen?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
            >
              Ja, löschen
            </Button>
            <Button variant="outlined" onClick={handleCloseDeleteModal}>
              Abbrechen
            </Button>
          </div>
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
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

export default BossManagement;
