import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to="/users" style={styles.link}>Gestión de Usuarios</Link>
      <Link to="/analytics" style={styles.link}>Analytics</Link>
      <Link to="/grupo" style={styles.link}>Grupo</Link>
      <Link to="/reportes" style={styles.link}>Reportes</Link>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '1rem',
    backgroundColor: '#282c34',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.2rem',
  }
};

export default Navbar;

