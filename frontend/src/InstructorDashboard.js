import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminNav from './AdminNav';
import ClassManagement from './ClassManagement';
import AzubiManagement from './AzubiManagement'; // Die bereits existierende Azubi-Verwaltung
import LevelManagement from './LevelManagement';

const InstructorDashboard = ({ token }) => {
  return (
      <div>
        {/* Navigation für Ausbilder */}
        <AdminNav />

      </div>
  );
};

export default InstructorDashboard;
