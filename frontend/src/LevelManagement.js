import React from 'react';
import GenericManagement from './GenericManagement';
import BossViewModal from './BossViewModal';
import DynamicViewModal from './DynamicViewModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiUrl = `${API_URL}/api/levels`;

const BossManagement = ({ token }) => {
  const columns = [
    { field: 'imageUrl', label: 'Bild', type: 'image' },
    { field: 'levelNumber', label: '#' },
    { field: 'requiredXP', label: 'XP' },
    { field: 'levelName', label: 'Name' },
    { field: 'description', label: 'Beschreibung' },
  ];

  const fields = [
    { key: 'imageUrl', label: 'Bild', type: 'image' },
    { key: 'levelNumber', label: 'Level', type: 'text' },
    { key: 'requiredXP', label: 'XP', type: 'text' },
    { key: 'levelName', label: 'Name', type: 'text' },
    { key: 'description', label: 'Beschreibung', type: 'textarea' }
  ];

  return (
    <GenericManagement
      entityType="level"
      token={token}
      columns={columns}
      apiUrl={apiUrl}
      title="Level-Verwaltung"
      ViewModalComponent={(props) => (
        <DynamicViewModal
          {...props}
          fields={fields}
          title={props.mode === 'add' ? 'Neues Level hinzufügen' : 'Level'}
        />
      )}
    />
  );
};

export default BossManagement;
