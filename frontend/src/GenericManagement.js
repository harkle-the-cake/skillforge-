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
import AdminNav from './AdminNav'; // Navigation einbinden
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GenericManagement = ({
  entityType,
  token,
  apiUrl,
  columns,
  title,
  ViewModalComponent,
  customHandleSave = null, // Neue Prop für benutzerdefinierte handleSave-Funktion
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [searchQuery, setSearchQuery] = useState('');

  const addIcon = "icons/create_icon.png";
  const viewIcon = "icons/view_icon.png";
  const editIcon = "icons/edit_icon.png";
  const deleteIcon = "icons/delete_icon.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        const sortedData = result.slice().sort((a, b) => b.id - a.id); // Absteigend nach ID sortieren
        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error(`Fehler beim Abrufen der Daten von ${apiUrl}:`, error);
      }
    };
    fetchData();
  }, [apiUrl, token]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredData(
        data.filter((item) =>
          columns.some((col) =>
            item[col.field]?.toString().toLowerCase().includes(lowercasedQuery)
          )
        )
      );
    }
  }, [searchQuery, data, columns]);

  const handleAdd = () => {
    setSelectedItem(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

const appendFormData = (formData, key, value) => {
  if (Array.isArray(value)) {
    // Arrays als JSON-String speichern
    formData.append(key, JSON.stringify(value));
  } else if (typeof value === 'object' && value !== null) {
    // Verschachtelte Objekte flach machen
    Object.keys(value).forEach((nestedKey) =>
      appendFormData(formData, `${key}.${nestedKey}`, value[nestedKey])
    );
  } else {
    // Primitive Werte direkt hinzufügen
    formData.append(key, value);
  }
};

const uploadImage = async (entity, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_URL}/api/images/${entityType}/${entity}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Fehler beim Hochladen des Bildes');
  }

  return response.json();
};

const saveItemData = async (savedItem, isAdding) => {
  try {
    const url = isAdding ? `${apiUrl}` : `${apiUrl}/${savedItem.id}`;
    const method = isAdding ? 'POST' : 'PUT';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(savedItem),
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Speichern der Daten: ${response.statusText}`);
    }

    const updatedItem = await response.json();
    return updatedItem; // Das Objekt mit der ID zurückgeben (z.B. nach Add)
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
    throw error;
  }
};

const defaultHandleSave = async (savedItem) => {
  try {
    // 1. JSON-Daten speichern
    const isAdding = modalMode === 'add';
    const updatedItem = await saveItemData(savedItem, isAdding);

    // 2. Bild hochladen, falls vorhanden
    if (savedItem.image) {
      const updatedItemWithImage = await uploadImage(updatedItem.id, savedItem.image);
      console.log(updatedItemWithImage);
      setData(data.map((item) => (item.id === updatedItemWithImage.id ? updatedItemWithImage : item)));
    } else {
      setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    }

    setModalOpen(false);
  } catch (error) {
    console.error('Fehler beim Speichern des Objekts:', error);
  }
};

const handleSave = customHandleSave || defaultHandleSave; // Standard oder benutzerdefinierte handleSave-Funktion verwenden


return (
    <Box>
      <AdminNav /> {/* Navigation */}
      <div className="content-area">
        <Typography variant="h4" gutterBottom>
          {title}
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

        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          startIcon={<img src={addIcon} alt="Add" style={{ width: '20px' }} />}
          style={{ marginBottom: '20px' }}
        >
          Neu hinzufügen
        </Button>

       <TableContainer
         component={Paper}
         className="custom-table-container" // Stil hinzufügen
         style={{
           maxHeight: '600px', // Maximale Höhe für Scrollen
           overflowY: 'auto', // Vertikales Scrollen aktivieren
         }}
       >
         <Table stickyHeader className="custom-table">
           <TableHead>
             <TableRow>
               {columns.map((col) => (
                 <TableCell key={col.field}>{col.label}</TableCell>
               ))}
               <TableCell>Aktionen</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {filteredData.map((item) => (
               <TableRow key={item.id}>
                 {columns.map((col) => (
                 <TableCell key={col.field}>
                   {col.type === 'image' && item[col.field] ? (
                     <img
                       src={`${API_URL}${item[col.field]}`} // URL zum Bild
                       alt="Bild"
                       style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                     />
                   ) : (
                     item[col.field]
                   )}
                 </TableCell>
               ))}
                 <TableCell>
                   <IconButton onClick={() => handleView(item)}>
                     <img src={viewIcon} alt="View" style={{ width: '20px' }} />
                   </IconButton>
                   <IconButton onClick={() => handleEdit(item)}>
                     <img src={editIcon} alt="Edit" style={{ width: '20px' }} />
                   </IconButton>
                   <IconButton onClick={() => handleDelete(item.id)}>
                     <img src={deleteIcon} alt="Delete" style={{ width: '20px' }} />
                   </IconButton>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </TableContainer>

        {/* Modal für Ansicht/Bearbeitung */}
        {modalOpen && (
          <ViewModalComponent
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            data={selectedItem}
            mode={modalMode}
            onSave={handleSave}
            token={token}
          />
        )}
      </div>
    </Box>
  );
};

export default GenericManagement;
