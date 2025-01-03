import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Externe CSS-Datei für das Styling

const AdminNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo links */}
      <img
        src="logo.png"  // Pfad zum Logo-Bild
        alt="Logo"
        className="logo"
      />

      {/* Titel in der Mitte */}
      <div className="navbar-title">
        Ausbilderbereich
      </div>

      {/* Dynamisches Menü */}
      <div className="navbar-links">
        <Link to="/level-ups">Level-UPs</Link>
        <Link to="/azubi-management">Azubis</Link>
        <Link to="/class-management">Klassen</Link>
        <Link to="/level-management">Level</Link>
        <Link to="/boss-management">Bosse</Link>
        <Link to="/quest-management">Quests</Link>
      </div>

      {/* Hamburger-Icon rechts (nur für mobile Geräte sichtbar) */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {/* Dropdown-Menü (nur sichtbar, wenn Hamburger-Menü aktiv ist) */}
      {menuOpen && (
        <div className="navbar-menu">
          <Link to="/level-ups" onClick={toggleMenu}>Level-UPs</Link>
          <Link to="/azubi-management" onClick={toggleMenu}>Azubi-Verwaltung</Link>
          <Link to="/class-management" onClick={toggleMenu}>Klassenverwaltung</Link>
          <Link to="/boss-management" onClick={toggleMenu}>Bosse</Link>
          <Link to="/quest-management" onClick={toggleMenu}>Quests</Link>
        </div>
      )}
    </nav>
  );
};

export default AdminNav;
