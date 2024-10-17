import React, { useEffect, useState } from 'react';
import { Container, TextField,Button,Modal, Box } from '@mui/material';
import axios from 'axios';
import CustomTable from './CustomTable';
import AdminNav from './AdminNav';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AzubiManagement = ({ token }) => {
  const [azubis, setAzubis] = useState([]);

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

  // Definiere die Spalten
  const columns = [
    { label: 'Benutzername', field: 'username' },
    { label: 'Erstellt', field: 'createdAt' },
  ];

  // Aktionen-Buttons rendern (Anzeigen, Bearbeiten, Löschen)
  const renderActions = (azubi) => (
    <div>
      <Button
        onClick={() => console.log(`Anzeigen: ${azubi.id}`)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/view_icon.png" alt="Anzeigen" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => console.log(`Bearbeiten: ${azubi.id}`)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/edit_icon.png" alt="Bearbeiten" style={{ width: '25px' }} />
      </Button>
      <Button
        onClick={() => console.log(`Löschen: ${azubi.id}`)}
        style={{ marginRight: '10px' }}
      >
        <img src="/icons/delete_icon.png" alt="Löschen" style={{ width: '25px' }} />
      </Button>
    </div>
  );

  return (
    <div className="layout">
        <AdminNav className="nav" />
        <div className="content">
            <CustomTable
              title="Azubi-Verwaltung"
              columns={columns}
              data={azubis}
              renderActions={renderActions} // Aktionen übergeben
            />
        </div>
    </div>
  );
};

export default AzubiManagement;
