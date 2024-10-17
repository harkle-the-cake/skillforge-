import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Modal, Box } from '@mui/material';
import axios from 'axios';
import CustomTable from './CustomTable';
import AdminNav from './AdminNav';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassManagement = ({ token }) => {
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Fetch classes from the server
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

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle class submission
  const handleAddClass = async () => {
    if (!newClassName) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/classes`,
        { className: newClassName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasses([...classes, res.data]); // Add new class to the table
      handleClose();
      setNewClassName(''); // Clear input after adding
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Klasse:', error);
    }
  };

  // Table columns
  const columns = [
    { field: 'id', label: 'ID' },
    { field: 'className', label: 'Klassenname' },
  ];

  // Aktionen-Buttons rendern (Anzeigen, Bearbeiten, Löschen)
   const renderActions = (classItem) => (
     <div>
       <Button
         onClick={() => console.log(`Anzeigen: ${classItem.id}`)}
         style={{ marginRight: '10px' }}
       >
         <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '25px' }} />
       </Button>
       <Button
         onClick={() => console.log(`Bearbeiten: ${classItem.id}`)}
         style={{ marginRight: '10px' }}
       >
         <img src="/icons/edit_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
       </Button>
       <Button
         onClick={() => console.log(`Löschen: ${classItem.id}`)}
         style={{ marginRight: '10px' }}
       >
         <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
       </Button>
     </div>
   );

  return (
    <div className="layout">
        <AdminNav/>
        <div className="content">
          <CustomTable
            title="Klassen"
            columns={columns}
            data={classes}
            renderActions={renderActions}
            addFunction={handleAddClass} // Add-Button einbinden
          />
        </div>
    </div>
  );
};

export default ClassManagement;
