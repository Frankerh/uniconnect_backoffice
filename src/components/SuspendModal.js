import React, { useState } from 'react';
import './SuspendModal.css';

function SuspendModal({ user, onClose, onSuspend }) {
  const [days, setDays] = useState(1); // Iniciar en 1

  const handleSuspend = () => {
    if (days < 1) {
      alert("La suspensión debe ser de al menos 1 día.");
      return;
    }

    const suspensionEndDate = new Date();
    suspensionEndDate.setDate(suspensionEndDate.getDate() + days);

    onSuspend(user.id, suspensionEndDate);
    onClose(); // Cerrar el modal
  };

  const handleCancel = () => {
    onClose(); // Cerrar el modal sin hacer nada
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Confirmar Suspensión</h2>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Carrera:</strong> {user.carrera}</p>
        <p><strong>Sede:</strong> {user.sede}</p>
        <p><strong>Fecha de Suspensión:</strong> {new Date().toLocaleDateString()}</p>
        <input 
          type="number" 
          value={days} 
          onChange={(e) => setDays(Math.max(1, e.target.value))} // Establecer un mínimo de 1
          placeholder="Número de días"
          min="1" // Establecer el valor mínimo a 1
        />
        <div className="modal-actions">
          <button onClick={handleSuspend}>Suspender</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default SuspendModal;
