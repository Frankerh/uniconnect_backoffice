import React, { useState } from 'react';
import './BanModal.css';

function BanModal({ user, onClose, onBan }) {
  const [confirmBan, setConfirmBan] = useState(false);

  const handleBanClick = () => {
    onBan(user.id); // Ejecutar la acción de banear
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>¿Estás seguro de banear a este usuario?</h2>
        <div className="user-info">
          <img src={user.profileImageUrl} alt="Profile" className="profile-picture" />
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Carrera:</strong> {user.carrera}</p>
        </div>
        <div className="actions">
          <button className="action-button" onClick={handleBanClick}>Sí, Banear</button>
          <button className="action-button" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default BanModal;
