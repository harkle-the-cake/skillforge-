import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Box, Typography } from '@mui/material';
import axios from 'axios';
import CustomTable from './CustomTable';
import AdminNav from './AdminNav';
import ClassViewModal from './ClassViewModal'; // Importiere das Modal für Ansicht, Bearbeitung und Hinzufügen
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassManagement = ({ token }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // Klassen vom Server abrufen
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Klassen:', error);
      }
    };

    fetchClasses();
  }, [token]);

  // Klassenansicht Modal öffnen
  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
    setModalMode('view');
    setOpenModal(true);
  };

  // Bearbeiten Modal öffnen
  const handleEditClass = (classItem) => {
    setSelectedClass(classItem);
    setModalMode('edit');
    setOpenModal(true);
  };

  // Hinzufügen Modal öffnen
  const handleAddClass = () => {
    setSelectedClass({ className: '', levels: [] }); // Leere Klasse initialisieren
    setModalMode('add');
    setOpenModal(true);
  };

  // Klasse speichern
  const handleSaveClass = async (updatedClass) => {
    try {
      if (modalMode === 'add') {
        const res = await axios.post(`${API_URL}/api/classes`, updatedClass, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses([...classes, res.data]); // Neue Klasse hinzufügen
      } else if (modalMode === 'edit') {
        await axios.put(`${API_URL}/api/classes/${selectedClass.id}`, updatedClass, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(classes.map((cls) => (cls.id === selectedClass.id ? updatedClass : cls))); // Klasse aktualisieren
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Klasse:', error);
    }
  };

  // Modal schließen
  const handleCloseModal = () => {
    setSelectedClass(null);
    setOpenModal(false);
  };

  // Lösch-Modal öffnen
  const handleOpenDeleteModal = (classItem) => {
    setClassToDelete(classItem);
    setOpenDeleteModal(true);
  };

  // Lösch-Modal schließen
  const handleCloseDeleteModal = () => {
    setClassToDelete(null);
    setOpenDeleteModal(false);
  };

  // Klasse löschen
  const handleDeleteClass = async () => {
    try {
      await axios.delete(`${API_URL}/api/classes/${classToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(classes.filter((cls) => cls.id !== classToDelete.id));
      handleCloseDeleteModal(); // Modal schließen nach dem Löschen
    } catch (error) {
      console.error('Fehler beim Löschen der Klasse:', error);
    }
  };

  // Aktionen-Buttons rendern (Anzeigen, Bearbeiten, Löschen)
  const renderActions = (classItem) => (
    <div>
      <Button onClick={() => handleViewClass(classItem)} style={{ marginRight: '10px' }}>
        <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '25px' }} />
      </Button>
      <Button onClick={() => handleEditClass(classItem)} style={{ marginRight: '10px' }}>
        <img src="/icons/edit_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => handleOpenDeleteModal(classItem)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
      </Button>
    </div>
  );

  // Spalten für die Tabelle definieren
  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'className', label: 'Klassenname' },
  ];

  return (
    <Container>
      <AdminNav />
      <div className="content-area">
        <CustomTable
          title="Klassenverwaltung"
          columns={columns}
          data={classes}
          renderActions={renderActions}
          addFunction={handleAddClass} // Add-Button zum Hinzufügen einer neuen Klasse
        />
      </div>

      {/* Modal zum Anzeigen, Bearbeiten oder Hinzufügen der Klasse */}
      <ClassViewModal
        open={openModal}
        onClose={handleCloseModal}
        classData={selectedClass}
        mode={modalMode}
        onSave={handleSaveClass}
      />

      {/* Modal für das Löschen einer Klasse */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Möchten Sie die Klasse <strong>{classToDelete?.className}</strong> wirklich löschen?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeleteClass}
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

export default ClassManagement;
