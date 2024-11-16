import React from 'react';
import GenericManagement from './GenericManagement';
import BossViewModal from './BossViewModal';
import DynamicViewModal from './DynamicViewModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiUrl = `${API_URL}/api/bosses`;

const BossManagement = ({ token }) => {
  const columns = [
    { field: 'imageUrl', label: 'Bild', type: 'image' },
    { field: 'name', label: 'Name' },
    { field: 'description', label: 'Beschreibung' },
  ];

  const fields = [
    { key: 'imageUrl', label: 'Bild', type: 'image' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Beschreibung', type: 'textarea' }
  ];

  return (
    <GenericManagement
      entityType="bosses"
      token={token}
      columns={columns}
      apiUrl={apiUrl}
      title="Boss-Verwaltung"
      ViewModalComponent={(props) => (
        <DynamicViewModal
          {...props}
          fields={fields}
          title={props.mode === 'add' ? 'Neuen Boss hinzufügen' : 'Boss'}
        />
      )}
    />
  );
};

export default BossManagement;
