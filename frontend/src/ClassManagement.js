import React from 'react';
import GenericManagement from './GenericManagement';
import ClassViewModal from './ClassViewModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiUrl = `${API_URL}/api/classes`;

const BossManagement = ({ token }) => {
  const columns = [
    { field: 'imageUrl', label: 'Bild', type: 'image' },
    { field: 'className', label: 'Name' },
    { field: 'description', label: 'Beschreibung' },
  ];

  const fields = [
    { key: 'imageUrl', label: 'Bild', type: 'image' },
    { key: 'className', label: 'Name', type: 'text' },
    { key: 'description', label: 'Beschreibung', type: 'textarea' }
  ];

  return (
    <GenericManagement
      entityType="classes"
      token={token}
      columns={columns}
      apiUrl={apiUrl}
      title="Klassen-Verwaltung"
      ViewModalComponent={(props) => (
          <ClassViewModal
             {...props}
             token={token}
             fields={fields}
             title={props.mode === 'add' ? 'Neuen Boss hinzufügen' : 'Boss'}
          />
      )}
    />
  );
};

export default BossManagement;
