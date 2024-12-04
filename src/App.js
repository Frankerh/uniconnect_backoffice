import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import UserManagement from './components/UserManagement';
import Analytics from './components/Analytics';
import CompleteUser from './components/CompleteUser';
import Grupocheck from './components/Grupocheck';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={styles.container}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/complete" element={<CompleteUser />} />
          <Route path="/" element={<Login />} />
          <Route path="/grupo" element={<Grupocheck />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    padding: '2rem',
  }
};

export default App;
