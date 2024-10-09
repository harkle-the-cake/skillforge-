import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Register from './Register';
import Login from './Login';
import Stats from './Stats';

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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Volle Höhe des Viewports
        }}>
          {/* Hauptinhalt */}
          <div style={{
            flexGrow: 1, // Füllt den restlichen Platz zwischen Header und Footer
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: '90vh'
          }}>
            <Routes>
              <Route path="/" element={<Login setToken={setToken} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/stats" element={<Stats token={token} />} />
            </Routes>
          </div>

          {/* Footer */}
          <footer style={{
            background: '#121212',
            color: '#fff',
            textAlign: 'center',
            padding: '10px 0',
            width: '100%',
            position: 'sticky',
            bottom: 0,
          }}>
            <p>Noch kein Konto? <Link to="/register" style={{ color: '#90caf9' }}>Registrieren</Link></p>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
