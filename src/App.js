import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import CompleteUser from './components/CompleteUser';
import Grupocheck from './components/Grupocheck';
import Reportes from './components/Reportes';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();

  // Ocultar Navbar en estas rutas
  const noNavbarRoutes = ['/login', '/', '/register', '/complete'];

  return (
    <>
      {/* Renderiza el Navbar solo si no está en las rutas específicas */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div style={styles.container}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete" element={<CompleteUser />} />

          {/* Rutas protegidas */}
          <Route path="/users" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/grupo" element={<Grupocheck />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '2rem',
  },
};

export default App;


