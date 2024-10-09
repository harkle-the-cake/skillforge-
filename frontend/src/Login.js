import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from './logo.png'; // Pfad zu deinem Logo

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });
      const token = res.data.token;
      setToken(token);

      // Token in localStorage speichern
      localStorage.setItem('authToken', token);

      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      if (userRole === 'Azubi') {
        navigate('/stats');
      } else if (userRole === 'Ausbilder') {
        navigate('/overview');
      }
    } catch (error) {
      setMessage('Fehler beim Login.');
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'radial-gradient(circle at center, #90caf9, #1b1b1b)', // Dunkler Hintergrund
      animation: 'wave 3s ease-in-out infinite', // Blaue wabernde Animation
    }}>
      <Container
        maxWidth="xs"
        style={{
          padding: '20px',
          backgroundColor: '#333',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={logo} alt="SkillForge Logo" style={{ width: '150px' }} />
        </div>

        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Anmelden
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Benutzername"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Passwort"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{ style: { color: '#fff' } }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
            Anmelden
          </Button>
        </form>
        {message && (
          <Typography variant="body2" color="error" align="center" style={{ marginTop: '20px' }}>
            {message}
          </Typography>
        )}
      </Container>
    </div>
  );
};

// Wabernde Animation
const styles = `
  @keyframes wave {
    0% {
      box-shadow: 0 0 25px #90caf9, 0 0 50px #90caf9, 0 0 100px #90caf9;
    }
    50% {
      box-shadow: 0 0 50px #90caf9, 0 0 100px #90caf9, 0 0 150px #90caf9;
    }
    100% {
      box-shadow: 0 0 25px #90caf9, 0 0 50px #90caf9, 0 0 100px #90caf9;
    }
  }
`;

// Fügt die CSS-Animation zur Seite hinzu
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Login;
