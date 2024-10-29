import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Register from './Register';
import Login from './Login';
import Stats from './Stats';
import InstructorDashboard from './InstructorDashboard';
import ClassManagement from './ClassManagement';
import LevelManagement from './LevelManagement';
import AzubiManagement from './AzubiManagement';
import BossManagement from './BossManagement';
import ViewClass from './ViewClass';

function App() {
  const [token, setToken] = useState('');

  // Dark Mode Theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9', // Blautöne für Buttons etc.
      },
      background: {
        default: '#121212', // Dunkler Hintergrund
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/stats" element={<Stats token={token} />} />
          <Route path="/azubi/:id" element={<Stats token={token}/>} />
          {/* Nur für Ausbilder */}
           <Route path="/instructor-dashboard" element={<InstructorDashboard token={token} />} />
           <Route path="/azubi-management" element={<AzubiManagement token={token} />} />
           <Route path="/class-management" element={<ClassManagement token={token} />} />
           <Route path="/level-management" element={<LevelManagement token={token} />} />
           <Route path="/boss-management" element={<BossManagement token={token} />} />
           <Route path="/class-management/:classId/levels" element={<LevelManagement token={token} />} />
           <Route path="/classes/:id" element={<ViewClass token={token} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
