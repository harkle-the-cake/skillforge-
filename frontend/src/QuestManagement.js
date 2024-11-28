import React from 'react';
import GenericManagement from './GenericManagement';
import DynamicViewModal from './DynamicViewModal';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const apiUrl = `${API_URL}/api/quests`;

const QuestManagement = ({ token }) => {
  const columns = [
    { field: 'imageUrl', label: 'Bild', type: 'image' },
    { field: 'title', label: 'Name' },
    { field: 'description', label: 'Beschreibung' },
    { field: 'xpReward', label: 'XP' },
    { field: 'goldReward', label: 'Gold' },
  ];

  const fields = [
    { key: 'imageUrl', label: 'Bild', type: 'image' },
    { key: 'title', label: 'Name', type: 'text' },
    { key: 'description', label: 'Beschreibung', type: 'textarea' },
    { key: 'xpReward', label: 'XP', type: 'text' },
    { key: 'goldReward', label: 'Gold', type: 'text' },
  ];

  return (
    <GenericManagement
      entityType="quests"
      token={token}
      columns={columns}
      apiUrl={apiUrl}
      title="Quest-Verwaltung"
      ViewModalComponent={(props) => (
        <DynamicViewModal
          {...props}
          fields={fields}
          title={props.mode === 'add' ? 'Neue Quest hinzufügen' : 'Quest'}
        />
      )}
    />
  );
};

export default QuestManagement;
