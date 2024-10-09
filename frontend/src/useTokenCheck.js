import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const useTokenCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Überprüfe, ob das Token abgelaufen ist
      if (decoded.exp < currentTime) {
        localStorage.removeItem('authToken'); // Token löschen
        navigate('/login'); // Zum Login weiterleiten
      }
    } else {
      navigate('/login'); // Zum Login weiterleiten, wenn kein Token vorhanden ist
    }
  }, [navigate]);
};

export default useTokenCheck;
