import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.link}>Inicio</Link>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/users" style={styles.link}>Gestión de Usuarios</Link>
      <Link to="/analytics" style={styles.link}>Analiticas</Link>
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
